import React, { useEffect, useState } from 'react';
import { UserJotView } from './UserJotView';
import { UserJot } from '../UserJot';

interface UserJotChangelogProps {
  visible: boolean;
  onClose: () => void;
}

export const UserJotChangelog: React.FC<UserJotChangelogProps> = ({
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
      if (!cancelled) setUrl(UserJot.changelogURL());
    });
    return () => { cancelled = true; };
  }, [visible]);

  return <UserJotView visible={visible} url={url} onClose={onClose} />;
};
