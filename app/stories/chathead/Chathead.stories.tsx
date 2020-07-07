import React from 'react';
import { action } from '@storybook/addon-actions';
import { Chathead } from "../../src/client/chathead/Chathead";

export default {
  title: 'Chathead',
  component: Chathead,
};

export const Example = () => <Chathead projectId={undefined} debuggeeId={undefined} breakpoints={[]} createBreakpoint={() => {}}/>;