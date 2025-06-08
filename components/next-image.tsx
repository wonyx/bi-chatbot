import Image from 'next/image'
import React from 'react'
export type NextImageProps = React.ComponentProps<typeof Image>
export function NextImage(props: NextImageProps) {
  return <Image {...props} />
}
