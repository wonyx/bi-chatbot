import Link from 'next/link'
import React from 'react'
export type NextLinkProps = React.ComponentProps<typeof Link>
export function NextLink(props: NextLinkProps) {
  return <Link {...props} />
}
