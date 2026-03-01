import React, { useEffect, useState } from 'react';
import { UserJotView } from './UserJotView';
import { UserJot } from '../UserJot';

interface UserJotFeedbackProps {
  visible: boolean;
  board?: string;
  onClose: () => void;
}

export const UserJotFeedback: React.FC<UserJotFeedbackProps> = ({
  visible,
  board,
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
      if (!cancelled) setUrl(UserJot.feedbackURL(board));
    });
    return () => { cancelled = true; };
  }, [visible, board]);

  return <UserJotView visible={visible} url={url} onClose={onClose} />;
};
