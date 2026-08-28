export class ChatViewConstants {
  static readonly TEXT_BLOCK_HEIGHT = 56;
  static readonly TEXT_BLOCK_BOTTOM_MARGIN = 8;

  static readonly SCROLL_ID = 'chatScrollingBlockId';

  static readonly DIALOGUE_ROOT_ID = 'chatRootBlockId';

  static readonly MESSAGE_ROW_PADDING_TOP = 8;

  static readonly MESSAGE_ROW_PADDING_BOTTOM = 32;

  static readonly INPUT_BUTTON_SIZE = 43;

  static readonly TEXT_FIELD_ROW_ID = 'chatTextFieldRowId';

  static readonly MESSAGE_BOX_ID = 'chatMessageBoxId';

  static readonly SIDE_CONTAINER_LARGE = 260;

  static readonly MARKDOWN_IMAGE_CLASSNAME = 'chatImageGalleryClass';

  static readonly MAX_ATTACHMENTS_IN_MESSAGE = 20;

  static readonly MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB;

  static readonly TEXT_SMOOTH_ANIMATION_DURATION_MS = 500;

  // Delay between consecutive elements in a fade-in batch, so a burst reads as a gentle
  // top-to-bottom wave instead of everything at once.
  static readonly TEXT_SMOOTH_STAGGER_STEP_MS = 50;

  // Upper bound on a batch's cumulative stagger, as a fraction of the fade duration, so the
  // wave stays proportional to the fade rather than to how many elements happened to arrive
  // together. At the default 500ms fade this is the 150ms ceiling the stagger always had.
  static readonly TEXT_SMOOTH_STAGGER_MAX_FRACTION = 0.3;
}
