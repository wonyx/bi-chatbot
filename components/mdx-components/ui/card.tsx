'use client';

import {
  Card as CardBase,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type CardProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
} & React.ComponentProps<typeof CardBase>;
export function Card(props: CardProps) {
  const { title, description, action, children, ...rest } = props;
  return (
    <CardBase {...rest}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {/* TODO */}
        {/* <CardAction>{action}</CardAction> */}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {children}
      </CardContent>
    </CardBase>
  );
}
