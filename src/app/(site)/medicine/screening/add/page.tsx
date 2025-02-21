'use client';

import { Tab, Tabs } from '@nextui-org/react';

import { AddForm } from './add-form';

export default function PerscriptionAddPage() {
  return (
    <div className="flex w-full flex-col">
      {/* <BreadCrumb items={breadcrumbItems} /> */}
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
          key="music"
          title={(
            <div className="flex items-center space-x-2">
              {/* <MusicIcon /> */}
              <span>กรณีฉุกเฉิน</span>
            </div>
          )}
        >
          <AddForm />
        </Tab>
      </Tabs>
    </div>
  );
}
