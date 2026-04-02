/**
 * Private Teleport Hook
 *
 * React hook for cross-chain private teleportation
 * Enables: XVM UTXO → ZNote (shielded) → Z-Chain AMM → destination
 */
import { useCallback, useEffect, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { encodeFunctionData, keccak256, toHex } from 'viem';
import { TeleportState, DEFAULT_PRIVATE_TELEPORT_CONFIG, PRIVATE_TELEPORT_ABI, ZNOTE_ABI, } from './private-teleport-types';
// ═══════════════════════════════════════════════════════════════════════════
// CRYPTO UTILITIES (STUB - REAL IMPL USES @luxfi/crypto)
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Generate Pedersen commitment to an amount
 * In production: Uses @luxfi/crypto Pedersen commitment scheme
 */
async function generateCommitment(amount, blindingFactor) {
    // Generate random blinding factor if not provided
    const bf = blindingFactor ?? toHex(BigInt(Math.random() * Number.MAX_SAFE_INTEGER));
    // Pedersen: C = g^amount * h^blinding
    // Simplified for now - real implementation uses elliptic curve ops
    const commitment = keccak256(`${toHex(amount)}${bf.slice(2)}`);
    return {
        commitment,
        blindingFactor: bf,
    };
}
/**
 * FHE-encrypt a value
 * In production: Uses @luxfi/fhe TFHE encryption
 */
async function fheEncrypt(value, publicKey) {
    // Simplified - real implementation uses TFHE
    const ciphertext = keccak256(`${toHex(value)}${publicKey.slice(2)}`);
    return {
        ciphertext,
        publicKey,
    };
}
/**
 * Generate Bulletproof range proof
 * In production: Uses @luxfi/crypto Bulletproof implementation
 */
async function generateRangeProof(amount, commitment, blindingFactor, rangeBits = 64) {
    // Simplified - real implementation generates actual Bulletproof
    const proof = keccak256(`${commitment}${blindingFactor.slice(2)}${toHex(amount).slice(2)}`);
    return {
        proof,
        commitment,
        rangeBits,
    };
}
/**
 * Generate nullifier for spending a note
 */
function generateNullifier(commitment, spendingKey, noteIndex) {
    return keccak256(`${commitment}${spendingKey.slice(2)}${toHex(noteIndex).slice(2)}`);
}
// ═══════════════════════════════════════════════════════════════════════════
// STATE MAPPING
// ═══════════════════════════════════════════════════════════════════════════
const stateMap = {
    0: TeleportState.INITIATED,
    1: TeleportState.SHIELDED,
    2: TeleportState.SWAP_COMPLETE,
    3: TeleportState.EXPORTED,
    4: TeleportState.COMPLETED,
    5: TeleportState.CANCELLED,
    6: TeleportState.EXPIRED,
};
// ═══════════════════════════════════════════════════════════════════════════
// HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════
export function usePrivateTeleport(options = {}) {
    const { config: configOverrides, pollInterval = 5000, onStateChange, } = options;
    const config = {
        ...DEFAULT_PRIVATE_TELEPORT_CONFIG,
        ...configOverrides,
    };
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [currentTeleportId, setCurrentTeleportId] = useState(null);
    const [currentState, setCurrentState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Store commitment secrets for later use
    const [secrets, setSecrets] = useState(new Map());
    // ─────────────────────────────────────────────────────────────────────────
    // INITIATE TELEPORT
    // ─────────────────────────────────────────────────────────────────────────
    const teleport = useCallback(async (request) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        setIsLoading(true);
        setError(null);
        try {
            // Generate Pedersen commitment
            const commitment = await generateCommitment(request.amount);
            // FHE-encrypt the amount
            const fhePublicKey = '0x' + '00'.repeat(32); // Would fetch from ZNote
            const encrypted = await fheEncrypt(request.amount, fhePublicKey);
            // Build Warp message (would be signed by validators in production)
            const warpMessage = encodeFunctionData({
                abi: [{ name: 'teleport', type: 'function', inputs: [
                            { name: 'sourceChain', type: 'bytes32' },
                            { name: 'sourceAsset', type: 'bytes32' },
                            { name: 'sender', type: 'address' },
                            { name: 'deadline', type: 'uint256' },
                        ], outputs: [] }],
                functionName: 'teleport',
                args: [
                    request.sourceChain,
                    request.sourceAsset,
                    walletClient.account.address,
                    BigInt(request.deadline),
                ],
            });
            // Call initiateTeleport
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'initiateTeleport',
                args: [
                    warpMessage,
                    commitment.commitment,
                    encrypted.ciphertext,
                    request.recipient,
                    request.destChain,
                    request.destAsset ?? request.sourceAsset,
                    request.privateSwap,
                ],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            // Wait for confirmation
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            // Extract teleportId from logs (simplified)
            const teleportId = receipt.logs[0]?.topics[1] ?? hash;
            // Store secrets for later
            const spendingKey = keccak256(toHex(Date.now()));
            setSecrets(prev => new Map(prev).set(teleportId, {
                blindingFactor: commitment.blindingFactor,
                spendingKey,
                noteIndex: 0, // Would be extracted from event
            }));
            setCurrentTeleportId(teleportId);
            setCurrentState(TeleportState.INITIATED);
            return teleportId;
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config]);
    // ─────────────────────────────────────────────────────────────────────────
    // EXECUTE PRIVATE SWAP
    // ─────────────────────────────────────────────────────────────────────────
    const executeSwap = useCallback(async (teleportId, poolId, minOutput) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        setIsLoading(true);
        setError(null);
        try {
            // Encrypt minimum output
            const fhePublicKey = '0x' + '00'.repeat(32);
            const encryptedMinOutput = await fheEncrypt(minOutput, fhePublicKey);
            // Generate swap proof (stub)
            const swapProof = keccak256(teleportId);
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'executePrivateSwap',
                args: [
                    teleportId,
                    poolId,
                    encryptedMinOutput.ciphertext,
                    swapProof,
                ],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            await publicClient.waitForTransactionReceipt({ hash });
            setCurrentState(TeleportState.SWAP_COMPLETE);
            onStateChange?.(teleportId, TeleportState.SWAP_COMPLETE);
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, onStateChange]);
    // ─────────────────────────────────────────────────────────────────────────
    // GET TELEPORT RECORD (defined early for use by other callbacks)
    // ─────────────────────────────────────────────────────────────────────────
    const getTeleportRecord = useCallback(async (teleportId) => {
        if (!publicClient) {
            throw new Error('Client not connected');
        }
        try {
            const result = await publicClient.readContract({
                address: config.teleportContract,
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'getTeleport',
                args: [teleportId],
            });
            const tuple = result;
            const [id, state, sourceChain, destChain, sourceAsset, destAsset, noteCommitment, encryptedAmount, nullifierHash, sender, recipient, deadline, createdBlock, privateSwap] = tuple;
            if (id === '0x' + '00'.repeat(32)) {
                return null;
            }
            return {
                teleportId: id,
                state: stateMap[state] ?? TeleportState.INITIATED,
                sourceChain,
                destChain,
                sourceAsset,
                destAsset,
                noteCommitment,
                encryptedAmount,
                nullifierHash: nullifierHash !== '0x' + '00'.repeat(32) ? nullifierHash : undefined,
                sender,
                recipient,
                deadline: Number(deadline),
                createdBlock: Number(createdBlock),
                privateSwap,
            };
        }
        catch {
            return null;
        }
    }, [publicClient, config]);
    // ─────────────────────────────────────────────────────────────────────────
    // EXPORT TO DESTINATION
    // ─────────────────────────────────────────────────────────────────────────
    const exportToDestination = useCallback(async (teleportId) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        const secret = secrets.get(teleportId);
        if (!secret) {
            throw new Error('Secrets not found for teleport');
        }
        setIsLoading(true);
        setError(null);
        try {
            // Get teleport record to get commitment
            const record = await getTeleportRecord(teleportId);
            if (!record) {
                throw new Error('Teleport not found');
            }
            // Generate range proof
            const rangeProof = await generateRangeProof(BigInt(0), // Would get actual amount from decrypted value
            record.noteCommitment, secret.blindingFactor);
            // Generate nullifier
            const nullifier = generateNullifier(record.noteCommitment, secret.spendingKey, secret.noteIndex);
            // Get Merkle proof from ZNote
            const merkleProofData = await publicClient.readContract({
                address: config.zNoteContract,
                abi: ZNOTE_ABI,
                functionName: 'getMerkleProof',
                args: [BigInt(secret.noteIndex)],
            });
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'exportToDestination',
                args: [
                    teleportId,
                    rangeProof.proof,
                    nullifier,
                    merkleProofData,
                ],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            await publicClient.waitForTransactionReceipt({ hash });
            setCurrentState(TeleportState.EXPORTED);
            onStateChange?.(teleportId, TeleportState.EXPORTED);
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, secrets, onStateChange]);
    // ─────────────────────────────────────────────────────────────────────────
    // COMPLETE TELEPORT
    // ─────────────────────────────────────────────────────────────────────────
    const completeTeleport = useCallback(async (teleportId, warpConfirmation) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        setIsLoading(true);
        setError(null);
        try {
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'completeTeleport',
                args: [teleportId, warpConfirmation],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            await publicClient.waitForTransactionReceipt({ hash });
            setCurrentState(TeleportState.COMPLETED);
            onStateChange?.(teleportId, TeleportState.COMPLETED);
            // Clean up secrets
            setSecrets(prev => {
                const next = new Map(prev);
                next.delete(teleportId);
                return next;
            });
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, onStateChange]);
    // ─────────────────────────────────────────────────────────────────────────
    // UNSHIELD TO X-CHAIN
    // ─────────────────────────────────────────────────────────────────────────
    const unshieldToXChain = useCallback(async (request) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        const secret = secrets.get(request.teleportId);
        if (!secret) {
            throw new Error('Secrets not found for teleport');
        }
        setIsLoading(true);
        setError(null);
        try {
            const record = await getTeleportRecord(request.teleportId);
            if (!record) {
                throw new Error('Teleport not found');
            }
            // Generate range proof (proves amount matches commitment)
            const rangeProof = await generateRangeProof(request.amount, record.noteCommitment, secret.blindingFactor);
            // Generate nullifier
            const nullifier = generateNullifier(record.noteCommitment, secret.spendingKey, secret.noteIndex);
            // Get Merkle proof
            const merkleProofData = await publicClient.readContract({
                address: config.zNoteContract,
                abi: ZNOTE_ABI,
                functionName: 'getMerkleProof',
                args: [BigInt(secret.noteIndex)],
            });
            // Encode destination address
            const destinationBytes = toHex(new TextEncoder().encode(request.destinationAddress));
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'unshieldToXChain',
                args: [
                    request.teleportId,
                    destinationBytes,
                    BigInt(request.amount),
                    nullifier,
                    merkleProofData,
                    rangeProof.proof,
                ],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            // Extract exportTxId from logs
            const exportTxId = receipt.logs[0]?.topics[1] ?? hash;
            setCurrentState(TeleportState.COMPLETED);
            onStateChange?.(request.teleportId, TeleportState.COMPLETED);
            // Clean up secrets
            setSecrets(prev => {
                const next = new Map(prev);
                next.delete(request.teleportId);
                return next;
            });
            return exportTxId;
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, secrets, onStateChange, getTeleportRecord]);
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE TRANSFER TO RECIPIENT
    // ─────────────────────────────────────────────────────────────────────────
    const privateTransfer = useCallback(async (request) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        const secret = secrets.get(request.teleportId);
        if (!secret) {
            throw new Error('Secrets not found for teleport');
        }
        setIsLoading(true);
        setError(null);
        try {
            const record = await getTeleportRecord(request.teleportId);
            if (!record) {
                throw new Error('Teleport not found');
            }
            // Generate new commitment for recipient
            const recipientCommitment = await generateCommitment(request.amount);
            // Encrypt note to recipient's viewing key
            const encryptedNote = keccak256(`${request.recipientViewKey}${recipientCommitment.commitment.slice(2)}`);
            // Generate nullifier
            const nullifier = generateNullifier(record.noteCommitment, secret.spendingKey, secret.noteIndex);
            // Get Merkle proof
            const merkleProofData = await publicClient.readContract({
                address: config.zNoteContract,
                abi: ZNOTE_ABI,
                functionName: 'getMerkleProof',
                args: [BigInt(secret.noteIndex)],
            });
            // Generate transfer proof (proves amount conservation)
            const transferProof = keccak256(`${record.noteCommitment}${recipientCommitment.commitment.slice(2)}`);
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'privateTransferToRecipient',
                args: [
                    request.teleportId,
                    recipientCommitment.commitment,
                    encryptedNote,
                    nullifier,
                    merkleProofData,
                    transferProof,
                ],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            // Extract note index from logs (simplified)
            const newNoteIndex = Number(receipt.logs[0]?.data?.slice(0, 66) ?? '0');
            setCurrentState(TeleportState.COMPLETED);
            onStateChange?.(request.teleportId, TeleportState.COMPLETED);
            // Clean up secrets for this teleport
            setSecrets(prev => {
                const next = new Map(prev);
                next.delete(request.teleportId);
                return next;
            });
            return newNoteIndex;
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, secrets, onStateChange, getTeleportRecord]);
    // ─────────────────────────────────────────────────────────────────────────
    // SPLIT AND TRANSFER
    // ─────────────────────────────────────────────────────────────────────────
    const splitAndTransfer = useCallback(async (teleportId, outputs) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        const secret = secrets.get(teleportId);
        if (!secret) {
            throw new Error('Secrets not found for teleport');
        }
        if (outputs.length === 0 || outputs.length > 16) {
            throw new Error('Invalid number of outputs (1-16)');
        }
        setIsLoading(true);
        setError(null);
        try {
            const record = await getTeleportRecord(teleportId);
            if (!record) {
                throw new Error('Teleport not found');
            }
            // Generate commitments for each output
            const outputNotes = await Promise.all(outputs.map(async (output) => {
                const commitment = await generateCommitment(output.amount);
                const encryptedNote = keccak256(`${output.recipient}${commitment.commitment.slice(2)}`);
                return {
                    commitment: commitment.commitment,
                    encryptedNote,
                    encryptedMemo: '0x',
                };
            }));
            // Generate nullifier
            const nullifier = generateNullifier(record.noteCommitment, secret.spendingKey, secret.noteIndex);
            // Get Merkle proof
            const merkleProofData = await publicClient.readContract({
                address: config.zNoteContract,
                abi: ZNOTE_ABI,
                functionName: 'getMerkleProof',
                args: [BigInt(secret.noteIndex)],
            });
            // Generate split proof (proves sum of outputs = input)
            const splitProof = keccak256(`${record.noteCommitment}${outputNotes.map(n => n.commitment.slice(2)).join('')}`);
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'splitAndTransfer',
                args: [
                    teleportId,
                    outputNotes,
                    nullifier,
                    merkleProofData,
                    splitProof,
                ],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            // Extract note indices from logs (simplified)
            const noteIndices = outputs.map((_, i) => i);
            setCurrentState(TeleportState.COMPLETED);
            onStateChange?.(teleportId, TeleportState.COMPLETED);
            // Clean up secrets for this teleport
            setSecrets(prev => {
                const next = new Map(prev);
                next.delete(teleportId);
                return next;
            });
            return noteIndices;
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, secrets, onStateChange, getTeleportRecord]);
    // ─────────────────────────────────────────────────────────────────────────
    // CANCEL TELEPORT
    // ─────────────────────────────────────────────────────────────────────────
    const cancelTeleport = useCallback(async (teleportId) => {
        if (!walletClient || !publicClient) {
            throw new Error('Wallet not connected');
        }
        setIsLoading(true);
        setError(null);
        try {
            const txData = encodeFunctionData({
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'cancelTeleport',
                args: [teleportId],
            });
            const hash = await walletClient.sendTransaction({
                to: config.teleportContract,
                data: txData,
                value: BigInt(0),
            });
            await publicClient.waitForTransactionReceipt({ hash });
            setCurrentState(TeleportState.CANCELLED);
            onStateChange?.(teleportId, TeleportState.CANCELLED);
            // Clean up secrets
            setSecrets(prev => {
                const next = new Map(prev);
                next.delete(teleportId);
                return next;
            });
        }
        catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            setError(e);
            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }, [walletClient, publicClient, config, onStateChange]);
    // Wrapper for external API
    const getTeleport = useCallback(async (teleportId) => {
        return getTeleportRecord(teleportId);
    }, [getTeleportRecord]);
    // ─────────────────────────────────────────────────────────────────────────
    // CHECK COMPLETION
    // ─────────────────────────────────────────────────────────────────────────
    const isComplete = useCallback(async (teleportId) => {
        if (!publicClient) {
            throw new Error('Client not connected');
        }
        try {
            const result = await publicClient.readContract({
                address: config.teleportContract,
                abi: PRIVATE_TELEPORT_ABI,
                functionName: 'isComplete',
                args: [teleportId],
            });
            return result;
        }
        catch {
            return false;
        }
    }, [publicClient, config]);
    // ─────────────────────────────────────────────────────────────────────────
    // POLLING
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!currentTeleportId || !publicClient || currentState === TeleportState.COMPLETED || currentState === TeleportState.CANCELLED) {
            return;
        }
        const poll = async () => {
            const record = await getTeleportRecord(currentTeleportId);
            if (record && record.state !== currentState) {
                setCurrentState(record.state);
                onStateChange?.(currentTeleportId, record.state);
            }
        };
        const interval = setInterval(poll, pollInterval);
        return () => clearInterval(interval);
    }, [currentTeleportId, currentState, publicClient, pollInterval, onStateChange, getTeleportRecord]);
    return {
        // Initiate
        teleport,
        executeSwap,
        // Export (unshield)
        exportToDestination,
        unshieldToXChain,
        // Private transfers (stay shielded)
        privateTransfer,
        splitAndTransfer,
        // Complete/cancel
        completeTeleport,
        cancelTeleport,
        // Queries
        getTeleport,
        isComplete,
        // State
        currentTeleportId,
        currentState,
        isLoading,
        error,
    };
}
