import { LayoutRenderer, LayoutRendererBuilder } from 'xingine';
import { DEFAULT_HEADER_COMPONENT } from './default/header';
import { DEFAULT_SIDER_COMPONENT } from './default/sider';
import { DEFAULT_FOOTER_COMPONENT } from './default/footer';
import { DEFAULT_DASHBOARD_COMMISAR } from './default/dashboard';
import { STATE_MANAGEMENT_COMMISSAR } from './default/state-management-simple';
import { CONTENT_STATE_TEST_COMMISSAR } from './body-only/content-state-test-clean';
import { COMPONENT_STATE_TEST_COMMISSAR } from './body-only/component-state-test';
import { LOGIN_COMMISSAR } from './default/login';
import { ERROR_PAGES_COMMISSAR } from './default/error-demo';
import {USER_ADD_FORM_COMMISSAR, USER_DETAIL_COMMISSAR} from "./body-only/user-add-form";

const headerClass = `fixed top-0 left-0 right-0 h-16 z-50 shadow-sm #{
                darkMode
                    ? "bg-gray-800 border-r border-gray-700"
                    : "bg-white border-r border-gray-200"
            }`;

const footerClass = `fixed bottom-0 left-0 right-0 h-16 z-30 transition-all duration-200 
    #{hasSider && collapsed ? "ml-20" : hasSider && collapsed === false ? "ml-52" : ""}
    #{
            darkMode
              ? "bg-gray-800 border-t border-gray-700"
              : "bg-white border-t border-gray-200"
          } shadow-sm`;
export const TAILWIND_LAYOUT: LayoutRenderer = LayoutRendererBuilder.create()
    .type('tailwind')
    .className('bg-gray-100 dark:bg-gray-900 min-h-screen')
    .withHeader(DEFAULT_HEADER_COMPONENT, {
        className: headerClass,
    })
    .withContent([
        DEFAULT_DASHBOARD_COMMISAR,
        STATE_MANAGEMENT_COMMISSAR,
        USER_ADD_FORM_COMMISSAR,
        USER_DETAIL_COMMISSAR,
        CONTENT_STATE_TEST_COMMISSAR,
        COMPONENT_STATE_TEST_COMMISSAR,
        ERROR_PAGES_COMMISSAR,
    ], {
        className: 'flex-1 bg-gray-50 p-6 overflow-auto transition-all duration-200 #{hasSider && collapsed ? "ml-20" : hasSider && collapsed === false ? "ml-52" : "ml-0"}',
    })
    .withSider(DEFAULT_SIDER_COMPONENT)
    .withFooter(DEFAULT_FOOTER_COMPONENT, {
        className: footerClass,
    })
    .build();

export const LOGIN_LAYOUT: LayoutRenderer = LayoutRendererBuilder.create()
    .type('login')
    .className('min-h-screen')
    .withContent([LOGIN_COMMISSAR,USER_DETAIL_COMMISSAR], {
        className: 'flex-1'
    })
    .build();

export const LAYOUT_MAP: Record<string, LayoutRenderer> = {
    tailwind: TAILWIND_LAYOUT,
    login: LOGIN_LAYOUT,
};
