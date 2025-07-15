
import React from 'react';
import { LogoTab } from './LogoTab';

interface LogosTabProps {
  onChange: () => void;
}

export const LogosTab: React.FC<LogosTabProps> = ({ onChange }) => {
  return <LogoTab onChange={onChange} />;
};
