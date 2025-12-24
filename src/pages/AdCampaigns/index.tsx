import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Plus, TrendingUp, DollarSign, Eye, MousePointer, PlayCircle, Wallet } from 'react-feather'
import { Card } from '../../components/Card'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { TYPE } from '../../theme'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import Column from '../../components/Column'
import { useWeb3React } from '@web3-react/core'

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled(Card)`
  padding: 1.5rem;
  background: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg3};
`

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary1}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary1};
`

const CampaignGrid = styled.div`
  display: grid;
  gap: 1rem;
`

const CampaignCard = styled(Card)`
  padding: 1.5rem;
  background: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg3};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.primary1};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const Badge = styled.div<{ color?: string }>`
  background: ${({ color }) => color || '#27AE60'}20;
  color: ${({ color }) => color || '#27AE60'};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`

const ProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.bg3};
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
`

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  background: ${({ theme }) => theme.primary1};
  width: ${({ percent }) => percent}%;
  transition: width 0.3s;
`

const CreateModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const ModalContent = styled(Card)`
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  background: ${({ theme }) => theme.bg0};
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary1};
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary1};
  }
`

const API_BASE = 'http://localhost:8088/api/v1'

interface Campaign {
  id: string
  name: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  status: string
  start_date?: string
  end_date?: string
}

interface Stats {
  total_campaigns: number
  active_campaigns: number
  total_impressions: number
  total_clicks: number
  total_spent: number
  average_ctr: number
}

export default function AdCampaigns() {
  const { account } = useWeb3React()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<Stats>({
    total_campaigns: 0,
    active_campaigns: 0,
    total_impressions: 0,
    total_clicks: 0,
    total_spent: 0,
    average_ctr: 0,
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    cpm: '',
    start_date: '',
    end_date: '',
    device_type: 'all',
    content_category: 'all',
  })

  useEffect(() => {
    fetchCampaigns()
    fetchStats()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_BASE}/campaigns`)
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const fetchStats = async () => {
    // Calculate stats from campaigns
    const active = campaigns.filter(c => c.status === 'active').length
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) : 0

    setStats({
      total_campaigns: campaigns.length,
      active_campaigns: active,
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      total_spent: totalSpent,
      average_ctr: avgCtr,
    })
  }

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
          cpm: parseFloat(formData.cpm),
          wallet_address: account,
        }),
      })
      
      if (response.ok) {
        setShowCreateModal(false)
        fetchCampaigns()
        setFormData({
          name: '',
          budget: '',
          cpm: '',
          start_date: '',
          end_date: '',
          device_type: 'all',
          content_category: 'all',
        })
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  return (
    <PageWrapper>
      <RowBetween style={{ marginBottom: '2rem' }}>
        <TYPE.largeHeader>Ad Campaigns</TYPE.largeHeader>
        <ButtonPrimary onClick={() => setShowCreateModal(true)}>
          <RowFixed gap="8px">
            <Plus size={20} />
            Create Campaign
          </RowFixed>
        </ButtonPrimary>
      </RowBetween>

      <StatsGrid>
        <StatCard>
          <RowBetween>
            <Column>
              <TYPE.subHeader color="text2">Total Spent</TYPE.subHeader>
              <TYPE.largeHeader>${stats.total_spent.toFixed(2)}</TYPE.largeHeader>
            </Column>
            <IconWrapper>
              <DollarSign size={20} />
            </IconWrapper>
          </RowBetween>
        </StatCard>

        <StatCard>
          <RowBetween>
            <Column>
              <TYPE.subHeader color="text2">Impressions</TYPE.subHeader>
              <TYPE.largeHeader>{formatNumber(stats.total_impressions)}</TYPE.largeHeader>
            </Column>
            <IconWrapper>
              <Eye size={20} />
            </IconWrapper>
          </RowBetween>
        </StatCard>

        <StatCard>
          <RowBetween>
            <Column>
              <TYPE.subHeader color="text2">Clicks</TYPE.subHeader>
              <TYPE.largeHeader>{formatNumber(stats.total_clicks)}</TYPE.largeHeader>
            </Column>
            <IconWrapper>
              <MousePointer size={20} />
            </IconWrapper>
          </RowBetween>
        </StatCard>

        <StatCard>
          <RowBetween>
            <Column>
              <TYPE.subHeader color="text2">Avg CTR</TYPE.subHeader>
              <TYPE.largeHeader>{(stats.average_ctr * 100).toFixed(2)}%</TYPE.largeHeader>
            </Column>
            <IconWrapper>
              <TrendingUp size={20} />
            </IconWrapper>
          </RowBetween>
        </StatCard>
      </StatsGrid>

      <TYPE.mediumHeader style={{ marginBottom: '1rem' }}>Active Campaigns</TYPE.mediumHeader>
      
      <CampaignGrid>
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id}>
            <RowBetween style={{ marginBottom: '1rem' }}>
              <Column>
                <RowFixed gap="12px">
                  <TYPE.body fontSize={18} fontWeight={600}>
                    {campaign.name}
                  </TYPE.body>
                  <Badge color={campaign.status === 'active' ? '#27AE60' : '#F39C12'}>
                    {campaign.status}
                  </Badge>
                </RowFixed>
              </Column>
              <ButtonSecondary padding="8px 12px">
                <PlayCircle size={16} />
              </ButtonSecondary>
            </RowBetween>

            <Row gap="2rem" style={{ marginBottom: '1rem' }}>
              <Column>
                <TYPE.small color="text2">Budget</TYPE.small>
                <TYPE.body fontWeight={500}>${campaign.budget.toFixed(2)}</TYPE.body>
              </Column>
              <Column>
                <TYPE.small color="text2">Spent</TYPE.small>
                <TYPE.body fontWeight={500}>${campaign.spent.toFixed(2)}</TYPE.body>
              </Column>
              <Column>
                <TYPE.small color="text2">Impressions</TYPE.small>
                <TYPE.body fontWeight={500}>{formatNumber(campaign.impressions)}</TYPE.body>
              </Column>
              <Column>
                <TYPE.small color="text2">Clicks</TYPE.small>
                <TYPE.body fontWeight={500}>{formatNumber(campaign.clicks)}</TYPE.body>
              </Column>
              <Column>
                <TYPE.small color="text2">CTR</TYPE.small>
                <TYPE.body fontWeight={500}>{(campaign.ctr * 100).toFixed(2)}%</TYPE.body>
              </Column>
            </Row>

            <div>
              <TYPE.small color="text2">Budget Progress</TYPE.small>
              <ProgressBar>
                <ProgressFill percent={(campaign.spent / campaign.budget) * 100} />
              </ProgressBar>
              <RowBetween>
                <TYPE.small>{((campaign.spent / campaign.budget) * 100).toFixed(0)}% used</TYPE.small>
                <TYPE.small>${(campaign.budget - campaign.spent).toFixed(2)} remaining</TYPE.small>
              </RowBetween>
            </div>
          </CampaignCard>
        ))}
      </CampaignGrid>

      <CreateModal isOpen={showCreateModal}>
        <ModalContent>
          <RowBetween style={{ marginBottom: '2rem' }}>
            <TYPE.mediumHeader>Create New Campaign</TYPE.mediumHeader>
            <ButtonSecondary onClick={() => setShowCreateModal(false)} padding="8px">
              ✕
            </ButtonSecondary>
          </RowBetween>

          <Column gap="1rem">
            <div>
              <TYPE.body marginBottom="8px">Campaign Name</TYPE.body>
              <Input
                placeholder="Enter campaign name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <Row gap="1rem">
              <Column style={{ flex: 1 }}>
                <TYPE.body marginBottom="8px">Budget (USDC)</TYPE.body>
                <Input
                  type="number"
                  placeholder="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </Column>
              <Column style={{ flex: 1 }}>
                <TYPE.body marginBottom="8px">CPM (Cost per 1000 impressions)</TYPE.body>
                <Input
                  type="number"
                  placeholder="2.00"
                  value={formData.cpm}
                  onChange={(e) => setFormData({ ...formData, cpm: e.target.value })}
                />
              </Column>
            </Row>

            <Row gap="1rem">
              <Column style={{ flex: 1 }}>
                <TYPE.body marginBottom="8px">Start Date</TYPE.body>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </Column>
              <Column style={{ flex: 1 }}>
                <TYPE.body marginBottom="8px">End Date</TYPE.body>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </Column>
            </Row>

            <div>
              <TYPE.body marginBottom="8px">Device Type</TYPE.body>
              <Select
                value={formData.device_type}
                onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
              >
                <option value="all">All Devices</option>
                <option value="ctv">Connected TV</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
              </Select>
            </div>

            <div>
              <TYPE.body marginBottom="8px">Content Category</TYPE.body>
              <Select
                value={formData.content_category}
                onChange={(e) => setFormData({ ...formData, content_category: e.target.value })}
              >
                <option value="all">All Categories</option>
                <option value="entertainment">Entertainment</option>
                <option value="sports">Sports</option>
                <option value="news">News</option>
                <option value="gaming">Gaming</option>
                <option value="lifestyle">Lifestyle</option>
              </Select>
            </div>

            {account ? (
              <ButtonPrimary onClick={handleCreateCampaign}>
                Create Campaign
              </ButtonPrimary>
            ) : (
              <ButtonPrimary disabled>
                <RowFixed gap="8px">
                  <Wallet size={20} />
                  Connect Wallet to Continue
                </RowFixed>
              </ButtonPrimary>
            )}
          </Column>
        </ModalContent>
      </CreateModal>
    </PageWrapper>
  )
}