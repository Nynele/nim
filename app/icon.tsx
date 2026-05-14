import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Nynele Profile'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

const DISCORD_ID = '799251427839049818'

export default async function Icon() {
  // Fetch the current avatar from Lanyard to get the latest hash
  let avatarUrl = `https://cdn.discordapp.com/embed/avatars/0.png` // Fallback
  
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, { next: { revalidate: 3600 } })
    const body = await res.json()
    if (body.data?.discord_user?.avatar) {
      avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${body.data.discord_user.avatar}.png?size=64`
    }
  } catch (e) {
    console.error('Failed to fetch avatar for icon', e)
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <img
          src={avatarUrl}
          width="32"
          height="32"
          style={{
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
