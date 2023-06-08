import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { Content, List, Root, Trigger } from '@radix-ui/react-tabs';

interface Tab {
  value: string;
  title: string;
  content: ReactNode;
}

interface TabsComponentProps {
  tabs: Tab[];
  className?: string;
  handleChange?: (value: string) => void;
}

const Tabs = ({ tabs, className, handleChange }: TabsComponentProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);
  const ref = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (ref.current) {
      const activeElement = ref.current.querySelector(
        '[data-state="active"]'
      ) as HTMLElement;
      if (activeElement) {
        const halfElementWidth = activeElement.offsetWidth / 2;
        const indicatorWidth = Math.min(16, halfElementWidth); // limit to 16px
        setIndicatorStyle({
          left:
            activeElement.offsetLeft + halfElementWidth - indicatorWidth / 2,
          width: indicatorWidth,
        });
      }
    }
  }, [activeTab]);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    if (handleChange) {
      handleChange(value);
    }
  };

  return (
    <Root
      className={className}
      defaultValue={tabs[0]?.value}
      onValueChange={handleValueChange}
    >
      <List
        className="relative flex gap-12 border-b border-porcelain"
        ref={ref}
      >
        {tabs.map(tab => (
          <Trigger
            value={tab.value}
            key={tab.value}
            className="relative z-10 text-dark-blue font-inter font-semibold mb-[6px]"
          >
            <span
              className={`mb-[6px] ${
                activeTab === tab.value && 'text-primary'
              }`}
            >
              {tab.title}
            </span>
          </Trigger>
        ))}
        <div
          className="absolute bottom-0 h-[2px] bg-primary rounded-[2px] transition-all ease-in-out duration-300"
          style={indicatorStyle}
        />
      </List>
      {tabs.map(tab => (
        <Content value={tab.value} key={tab.value}>
          {tab.content}
        </Content>
      ))}
    </Root>
  );
};

export default Tabs;
