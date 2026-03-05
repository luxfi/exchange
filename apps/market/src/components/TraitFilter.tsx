'use client'

import { useState } from 'react'
import type { NFTTrait } from '@/lib/explorer'

interface TraitGroup {
  trait_type: string
  values: { value: string; count: number }[]
}

interface TraitFilterProps {
  instances: Array<{ metadata?: { attributes?: NFTTrait[] } | null }>
  selectedTraits: Record<string, Set<string>>
  onTraitToggle: (traitType: string, value: string) => void
  onClear: () => void
}

export function TraitFilter({ instances, selectedTraits, onTraitToggle, onClear }: TraitFilterProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Aggregate trait groups
  const traitGroups: TraitGroup[] = []
  const groupMap = new Map<string, Map<string, number>>()

  for (const inst of instances) {
    const attrs = inst.metadata?.attributes
    if (!attrs) continue
    for (const attr of attrs) {
      if (!attr.trait_type) continue
      let valueMap = groupMap.get(attr.trait_type)
      if (!valueMap) {
        valueMap = new Map()
        groupMap.set(attr.trait_type, valueMap)
      }
      const val = String(attr.value)
      valueMap.set(val, (valueMap.get(val) ?? 0) + 1)
    }
  }

  for (const [trait_type, valueMap] of groupMap) {
    const values = Array.from(valueMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
    traitGroups.push({ trait_type, values })
  }
  traitGroups.sort((a, b) => a.trait_type.localeCompare(b.trait_type))

  const hasSelected = Object.values(selectedTraits).some((s) => s.size > 0)

  if (traitGroups.length === 0) return null

  return (
    <div
      style={{
        background: 'var(--card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: 16,
        width: 240,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Traits</div>
        {hasSelected && (
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {traitGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.trait_type)
        const selected = selectedTraits[group.trait_type]
        const activeCount = selected?.size ?? 0

        return (
          <div key={group.trait_type} style={{ marginBottom: 4 }}>
            <button
              onClick={() => {
                const next = new Set(expandedGroups)
                if (isExpanded) next.delete(group.trait_type)
                else next.add(group.trait_type)
                setExpandedGroups(next)
              }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <span>
                {group.trait_type}
                {activeCount > 0 && (
                  <span style={{ marginLeft: 6, color: 'var(--accent)', fontSize: 11 }}>({activeCount})</span>
                )}
              </span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
            </button>
            {isExpanded && (
              <div style={{ paddingLeft: 4, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.values.slice(0, 20).map((v) => {
                  const isActive = selected?.has(v.value) ?? false
                  return (
                    <button
                      key={v.value}
                      onClick={() => onTraitToggle(group.trait_type, v.value)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: 6,
                        background: isActive ? 'rgba(232,232,232,0.1)' : 'transparent',
                        border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                        color: isActive ? 'var(--foreground)' : 'var(--muted)',
                        cursor: 'pointer',
                        fontSize: 12,
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.value}
                      </span>
                      <span style={{ fontSize: 11, flexShrink: 0, marginLeft: 8 }}>{v.count}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
