'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ComboboxDemoProps = {
  searchParamKey: string;
  dataset: {
    source: any[];
  };
};
export function ComboboxDemo(props: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const { searchParamKey } = props;
  const options = React.useMemo(
    () =>
      props.dataset.source.map((item: any) => ({
        label: item[0],
        value: item[1],
      })),

    [props.dataset],
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const value = searchParams.get(props.searchParamKey) || '';

  const onSelect = (currentValue: string) => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (currentValue === value) {
      params.delete(props.searchParamKey);
    } else {
      params.set(props.searchParamKey, currentValue);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {/* @ts-ignore */}
          {value ? options.find((e) => e.value === value)?.label : 'Select...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command defaultValue={value}>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {/* @ts-ignore */}
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={onSelect}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
