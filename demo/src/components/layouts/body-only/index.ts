import { LayoutRenderer, LayoutRendererBuilder } from 'xingine';
import { GLOBAL_STATE_TEST_COMMISSAR } from './global-state-test';
import { CONTENT_STATE_TEST_COMMISSAR } from './content-state-test';
import { COMPONENT_STATE_TEST_COMMISSAR } from './component-state-test';
import { USER_ADD_FORM_COMMISSAR } from './user-add-form';

// Body-Only Layout - Just content commissars, no header/sidebar/footer
export const BODY_ONLY_LAYOUT: LayoutRenderer = LayoutRendererBuilder.create()
  .type('body-only')
  .className('min-h-screen bg-gray-50')
  .withContent([
    GLOBAL_STATE_TEST_COMMISSAR,
    CONTENT_STATE_TEST_COMMISSAR, 
    COMPONENT_STATE_TEST_COMMISSAR,
    USER_ADD_FORM_COMMISSAR
  ], {
    className: 'w-full min-h-screen p-8 overflow-auto',
  })
  .build();
