"use client"

import * as React from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { shortenAddress } from "@/lib/utils"

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <Button variant="connect" onClick={() => disconnect()}>
        {shortenAddress(address)}
      </Button>
    )
  }

  return (
    <Button
      variant="connect"
      onClick={() => {
        const injectedConnector = connectors.find((c) => c.id === "injected")
        if (injectedConnector) {
          connect({ connector: injectedConnector })
        }
      }}
    >
      Connect Wallet
    </Button>
  )
}
