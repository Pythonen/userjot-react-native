import React, { useEffect, useState } from 'react';
import { UserJotView } from './UserJotView';
import { UserJot } from '../UserJot';

interface UserJotRoadmapProps {
  visible: boolean;
  onClose: () => void;
}

export const UserJotRoadmap: React.FC<UserJotRoadmapProps> = ({
  visible,
  onClose,
}) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    UserJot.ready().then(() => {
      if (!cancelled) setUrl(UserJot.roadmapURL());
    });
    return () => { cancelled = true; };
  }, [visible]);

  return <UserJotView visible={visible} url={url} onClose={onClose} />;
};
