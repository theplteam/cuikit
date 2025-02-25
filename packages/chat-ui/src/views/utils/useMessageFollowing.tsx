import * as React from 'react';
import { ChatViewConstants } from '../ChatViewConstants';
import { ChatScrollerType } from './ChatScrollerType';
import { useTheme } from '@mui/material/styles';
import { useThreadContext } from '../thread/ThreadContext';
import { when } from '../../utils/observers/when';
import { MessageModel } from '../../models/MessageModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { chatClassNames } from '../core/chatClassNames';

class FollowingClass {
  private _observer?: ResizeObserver;

  private _isFollowing = false;

  private _elementPosition: 'top' | 'bottom' = 'top';

  private _removeListeners?: () => void;

  private _yDown = 0;

  constructor(
    private _model: MessageModel,
    private getPosition: ChatScrollerType,
    private scrollTo: (y: number) => void,
    private marginTop: number,
  ) {}

  init = () => {
    when(
      this._model.typing,
      () => !!this._model.typing.value,
      () => {
        const lastMessage = document.getElementById(ChatViewConstants.MESSAGE_BOX_ID)
          ?.querySelector(`[${ChatViewConstants.MESSAGE_DATA_SCROLL_ANCHOR}="true"]`);

        if (lastMessage) {
          // Call disconnect listener
          when(
            this._model.typing,
            () => this._model.typing.value === false,
            () => {
              this.disconnect();
            },
          );

          this._observer = new ResizeObserver(() => {
            this._scroll(lastMessage);
          });
          this._observer.observe(lastMessage);

          const { scrollHeight, offsetHeight } = this.getPosition();

          if (scrollHeight <= offsetHeight) this.setFollowing(true);
        }

      },
    );

    return this;
  }

  setFollowing = (value: boolean) => {
    if (value) {
      const { scrollHeight, offsetHeight } = this.getPosition();
      this._elementPosition = scrollHeight > offsetHeight ? 'bottom' : 'top';
      this._initEventListeners();
    }

    this._isFollowing = value;
  }


  private offFollowing = () => {
    this._isFollowing = false;
  }

  private handleTouchStart = (event: TouchEvent) => {
    this._yDown = event.touches[0].clientY;
  }


  private handleTouchMove = (event: TouchEvent) => {
    if (!this._yDown) {
      return;
    }

    const yUp = event.touches[0].clientY;
    const yDiff = Math.abs(this._yDown - yUp);

    if (yDiff > 20) this.offFollowing();
  }

  private _initEventListeners = () => {
    this._removeListeners?.();
    document.addEventListener('wheel', this.offFollowing);

    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);

    this._removeListeners = () => {
      document.removeEventListener('wheel', this.offFollowing);
      document.removeEventListener('touchstart', this.handleTouchStart);
      document.removeEventListener('touchmove', this.handleTouchMove);
    };
  }

  disconnect = () => {
    this._observer?.disconnect();
    this._removeListeners?.();
  }

  private _scroll = (element: Element) => {
    const { scrollTop } = this.getPosition();
    if (this._isFollowing) {
      const bounds = element.getBoundingClientRect();
      const position = this._elementPosition;
      const topPadding = 8;
      // Тут нужно минусовать высоту скролл бара, т.к. иначе верхушка сообщения будет оставаться за ним
      const minus = position === 'top' ? this.marginTop + topPadding : 0;

      this.scrollTo(bounds[position] + scrollTop - minus);
    }
  }
}


export const useMessageFollowing = (
  showButton: boolean,
  getPosition: ChatScrollerType,
  scrollTo: (y: number) => void,
) => {
  const [followingModel, setFollowingModel] = React.useState<FollowingClass | undefined>();
  const { apiRef } = useThreadContext();

  const messages = useObserverValue(apiRef.current?.getListener('allMessages')) ?? [];

  const lastMessageModel = React.useMemo(() => {
    if (!messages.length) return undefined;

    const model = messages[messages.length - 1];
    return model?.isAssistant ? model : undefined;
  }, [messages.length]);

  const theme = useTheme();

  React.useEffect(() => {
    const dialogueContaier = document.getElementsByClassName(chatClassNames.threadRoot)[0];
    const marginTop = dialogueContaier.getBoundingClientRect().top ?? 0;

    const newModel = lastMessageModel
      // TODO: hardcode
      ? (new FollowingClass(lastMessageModel, getPosition, scrollTo, marginTop)).init()
      : undefined;

    setFollowingModel(newModel);

    return () => {
      followingModel?.disconnect();
    };
  }, [lastMessageModel, theme]);

  React.useEffect(() => {
    if (followingModel && !showButton) {
      followingModel.setFollowing(true);
    }
  }, [showButton]);
}
