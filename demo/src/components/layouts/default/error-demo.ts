import { CommissarBuilder, LayoutComponentDetailBuilder } from 'xingine';

// Error Pages Demo Commissar
export const ERROR_PAGES_COMMISSAR = CommissarBuilder.create()
  .path('/error-demo')
  .wrapper()
  .className('min-h-full max-w-full w-full p-6')
  .addChild(
    LayoutComponentDetailBuilder.create()
      .dynamic('ErrorPagesDemo')
      .className('error-pages-demo-container')
      .build()
  )
  .build();
