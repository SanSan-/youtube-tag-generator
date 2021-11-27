import React, { ReactElement } from 'react';

export const PAGE_SIZE_OPTIONS = ['1', '10', '25', '50', '100'];

export const COMP_OPTIONS: ReactElement[] = [
  <div key={0} style={{ color: 'darkgreen' }}>очень низкая</div>,
  <div key={1} style={{ color: 'green' }}>низкая</div>,
  <div key={2} style={{ color: 'darkgoldenrod' }}>средняя</div>,
  <div key={3} style={{ color: 'red' }}>высокая</div>,
  <div key={4} style={{ color: 'darkred' }}>очень высокая</div>
];
