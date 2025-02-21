'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/dropdown';

import {Badge} from "@nextui-org/badge";

import React from 'react';
import {Button} from "@nextui-org/button";
import {
  Activity,
  ChevronDown,
  Flash,
  Locks,
  NotificationIcon,
  Scale,
  Server,
  TagUser,
} from '@/components/common/icons';

export const Notifications = () => {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Locks className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };
  return (
    <Dropdown placement="bottom-end" backdrop="blur">
      <Badge content="99+" shape="circle" color="danger">
        <DropdownTrigger>
          <Button
            radius="full"
            isIconOnly
            aria-label="more than 99 notifications"
            variant="light"
          >
            <NotificationIcon size={24} />
          </Button>
        </DropdownTrigger>
      </Badge>

      <DropdownMenu
        aria-label="ACME features"
        className="w-[340px]"
        itemClasses={{
          base: 'gap-4',
        }}
      >
        <DropdownSection title="Notificacions">
          <DropdownItem
            key="autoscaling"
            description="ACME scales apps to meet user demand, automagically, based on load."
            startContent={icons.scale}
          >
            Autoscaling
          </DropdownItem>
          <DropdownItem
            key="usage_metrics"
            description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
            startContent={icons.activity}
          >
            Usage Metrics
          </DropdownItem>
          <DropdownItem
            key="production_ready"
            description="ACME runs on ACME, join us and others serving requests at web scale."
            startContent={icons.flash}
          >
            Production Ready
          </DropdownItem>
          <DropdownItem
            key="99_uptime"
            description="Applications stay on the grid with high availability and high uptime guarantees."
            startContent={icons.server}
          >
            +99% Uptime
          </DropdownItem>
          <DropdownItem
            classNames={{
              base: 'py-1',
              title: 'text-base font-semibold',
            }}
            key="supreme_support"
            description="Overcome any challenge with a supporting team ready to respond."
            startContent={icons.user}
          >
            +Supreme Support
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
