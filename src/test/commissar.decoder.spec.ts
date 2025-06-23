import { UserDetail, UserLoginDto } from './dto/commisar.dto';
import { extractMeta } from '../utils/commissar.utils';
import {
  CommissarProperties,
  detailMetaDecoder,
  dynamicShapeDecoder,
  extractRouteParams,
  formMetaDecoder,
  isGroupCondition,
  modulePropertiesListDecoder,
  nestedCheckboxOptionListDecoder,
  resolveDynamicPath,
  resolvePath,
  SearchQuery,
} from 'xingine';
import { searchQueryDecoder } from 'xingine/dist/core/decoders/expression.decoder';

describe('extractMeta test', () => {
  it('Search Query decoding test', () => {
    const rawQuery = {
      and: [
        { field: 'status', operator: 'eq', value: 'active' },
        {
          or: [
            { field: 'email', operator: 'like', value: '@gmail.com' },
            { field: 'role', operator: 'eq', value: 'admin' },
          ],
        },
      ],
    };

    const decoded: SearchQuery = searchQueryDecoder.verify(rawQuery);

    // top level keys
    expect(decoded).toHaveProperty('and');
    expect(decoded.and).toHaveLength(2);

    // first condition should be base
    const statusCondition = decoded.and?.[0];
    expect(statusCondition).toEqual({
      field: 'status',
      operator: 'eq',
      value: 'active',
    });

    // second should be a group condition
    const nestedOrGroup = decoded.and?.[1];
    expect(nestedOrGroup).toHaveProperty('or');
    if (isGroupCondition(nestedOrGroup)) {
      expect(nestedOrGroup.or).toHaveLength(2);

      expect(nestedOrGroup.or?.[0]).toEqual({
        field: 'email',
        operator: 'like',
        value: '@gmail.com',
      });

      expect(nestedOrGroup.or?.[1]).toEqual({
        field: 'role',
        operator: 'eq',
        value: 'admin',
      });
    } else {
      throw new Error('Expected a group condition with an OR clause');
    }
  });

  it('Nested option decoder test', () => {
    const nestedOptions = [
      {
        value: 'UserModule',
        children: [
          {
            label: 'Create or update user',
            value: 'UserModule::create',
          },
          {
            label: 'View user',
            value: 'UserModule::view',
          },
        ],
      },
      {
        value: 'CategoryModule',
        children: [
          {
            label: 'Create or update category',
            value: 'CategoryModule::create',
          },
          {
            label: 'View category',
            value: 'CategoryModule::view',
          },
        ],
      },
      {
        value: 'RuleModule',
        children: [
          {
            label: 'Create or update rule',
            value: 'RuleModule::create',
          },
          {
            label: 'View rule',
            value: 'RuleModule::view',
          },
        ],
      },
    ];

    const decode = nestedCheckboxOptionListDecoder.verify(nestedOptions);

    console.log(decode);
  });

  it('Should resolve named path from params', () => {
    const params = {
      username: 'someusername@usernam.com',
      user: {
        username: 'nestedUsername@inside.user',
        roles: ['Chairman', 'Peasant', 'PrinceLing'],
      },
    };

    const outerUsername = resolvePath(params, 'username');
    const nestedUsername = resolvePath(params, 'user.username');
    const roles = resolvePath(params, 'user.roles');
    const chairman = resolvePath(params, 'user.roles.0');
    const peasant = resolvePath(params, 'user.roles.1');
    const princeLing = resolvePath(params, 'user.roles.2');

    expect(outerUsername).toBe('someusername@usernam.com');
    expect(nestedUsername).toBe('nestedUsername@inside.user');
    expect(chairman).toBe('Chairman');
    expect(peasant).toBe('Peasant');
    expect(princeLing).toBe('PrinceLing');
  });

  it('Should resolve dynamic path', () => {
    const res = {
      username: 'someusername@usernam.com',
      user: {
        username: 'nestedUsername@inside.user',
      },
    };
    const resolvedPath1 = resolveDynamicPath('/mycustompath/:username', res);
    expect(resolvedPath1).toBe('/mycustompath/someusername%40usernam.com');

    const conditionalProvidedPath = {
      username: 'user.username',
    };
    const resolvedPath2 = resolveDynamicPath(
      '/mycustompath/:username',
      res,
      conditionalProvidedPath,
    );
    expect(resolvedPath2).toBe('/mycustompath/nestedUsername%40inside.user');
  });

  it('RoutesParam are replaced properly ', () => {
    const apiResp = {
      user: {
        bio: '',
        email: 'side@s.com',
        image: '',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpZGVAcy5jb20iLCJleHAiOjE3NTI0MDY0NTguNjA0LCJpZCI6ImUxYjljY2ZlLWQ0ZTctNDcwNi1iNzc2LTUyNjI2ZjlmZmU3YyIsInVzZXJuYW1lIjoic2lkZXNvbWV0aGluIiwiaWF0IjoxNzQ3MjIyNDU4fQ.G_xS3mYkpxIKcWLY6npRb2Hl2oxNmzObM-jpVnQF_nk',
        username: 'sidesomethin',
        roles: [],
      },
    };

    const redirectionPath = '/abc/:user.username';
    const replacedPath = resolveDynamicPath(
      redirectionPath,
      dynamicShapeDecoder.verify(apiResp),
    );
    expect(replacedPath).toBe('/abc/sidesomethin');

    const data = {
      component: 'test',
      users: [{ name: 'Alice' }, { name: 'Bob', profile: { age: 30 } }],
    };

    expect(resolvePath(data, 'component')).toBe('test');
    expect(resolvePath(data, 'users.1.profile.age')).toBe(30);
    expect(resolvePath(data, 'users.0.name')).toBe('Alice');
    expect(resolvePath(data, 'users.2.name')).toBe(undefined);
  });
  it('routesParam extraction property ', () => {
    const str = '/abc/:one.a/test/:two.d.c/:three';
    const slugs = extractRouteParams(str);
    const sluggedApi = slugs.reduce((acc, key) => {
      return `${acc}/:${key}`;
    }, '');
    expect(sluggedApi).toBe('/:one.a/:two.d.c/:three');
  });
  it('should decode dynamic object', async () => {
    const justAString = 'just a String';
    const numbr = 2;
    const bool = true;
    const num = dynamicShapeDecoder.verify(numbr);
    const boole = dynamicShapeDecoder.verify(bool);
    const date = dynamicShapeDecoder.verify(new Date());
    console.log(date);
    console.log(num);
    console.log(boole);
    const str = dynamicShapeDecoder.verify(justAString);
    console.log(str);

    const nestedObject = {
      a: 'value for a',
      b: 'value for b',
      c: 'value of c',
    };
    const nestedRecord = dynamicShapeDecoder.verify(nestedObject);
    console.log(nestedRecord);
    const deepNested = {
      one: {
        one1: 'Vlaue of one1',
        one2: 2,
        one3: true,
      },
      two: 'abc',
      three: 3,
      four: 4.5,
      bool: false,
    };

    const deepNesting = dynamicShapeDecoder.verify(deepNested);
    console.log(deepNesting);
  });

  it('should decode metadata from CommissarProperties for FormRenderer', async () => {
    const options: CommissarProperties = {
      component: 'UserLogin',
      directive: UserLoginDto,
      operative: 'FormRenderer',
    };
    const meta = extractMeta(options, '');
    const decodedMeta = formMetaDecoder.decode(meta.properties);
    expect(decodedMeta.ok).toBe(true);
    expect(decodedMeta.error).toBe(undefined);
    console.log('the decodedMeta', decodedMeta);
  });

  it('should decode metadata from CommissarProperties for DetailRenderer', async () => {
    const options: CommissarProperties = {
      component: 'UserDetail',
      directive: UserLoginDto,
      operative: 'DetailRenderer',
    };
    const meta = extractMeta(options, '');
    console.log(JSON.stringify(meta, null, 2));

    const decodedMeta = detailMetaDecoder.verify(meta.properties);
    console.log(decodedMeta);
    /*console.log(decodedMeta.value);
        expect(decodedMeta.ok).toBe(true);
        expect(decodedMeta.error).toBe(undefined);*/
    console.log('the decodedMeta', decodedMeta);
  });

  it('can decode whole string properly ', async () => {
    const json = [{"name":"User","uiComponent":[{"component":"UserAnalytics","path":"/User/userAnalytics","meta":{"component":"ChartRenderer","properties":{"charts":[{"type":"bar","title":"Monthly Revenue","labels":["Jan","Feb","Mar"],"datasets":[{"label":"Revenue","data":[120,150,170]},{"label":"Expenses","data":[80,100,120]}]},{"type":"pie","title":"User Roles Distribution","labels":["Admin","User","Guest"],"datasets":[{"label":"Users","data":[10,50,20]}]},{"type":"line","title":"Weekly User Signups","labels":["Week 1","Week 2","Week 3","Week 4"],"datasets":[{"label":"Organic","data":[40,60,75,90],"borderColor":"#1890ff"},{"label":"Referral","data":[20,30,50,65],"borderColor":"#f5222d"}]},{"type":"scatter","title":"Load vs Response Time","datasets":[{"label":"Performance","data":[{"x":10,"y":150},{"x":20,"y":180},{"x":30,"y":200},{"x":40,"y":240},{"x":50,"y":300}],"backgroundColor":"#52c41a"}]}]}}},{"component":"AddRole","path":"/User/createRole","meta":{"component":"FormRenderer","properties":{"action":"/users/addRole","fields":[{"label":"Role Name","inputType":"input","required":true,"properties":{"placeholder":"Enter Role Name","maxLength":20,"validationRegex":"^ROLE_[a-zA-Z0-9_]{0,15}$","regexValidationMessage":"Role name must start with \"ROLE_\" and can contain alphanumeric characters and underscores, up to 20 characters in total."},"name":"name"},{"label":"Actual Permission assigned","inputType":"nestedcheckbox","required":true,"properties":{"fetchAction":"users/permission-lookup"},"name":"moduledPermission"}]}}},{"component":"UserDetail","path":"/User/userDetail/:username","meta":{"component":"DetailRenderer","properties":{"fields":[{"name":"user","label":"User","inputType":"object","properties":{"fields":[{"name":"bio","label":"Bio","inputType":"text"},{"name":"email","label":"Email","inputType":"text"},{"name":"firstName","label":"FirstName","inputType":"text"},{"name":"lastName","label":"LastName","inputType":"text"},{"name":"image","label":"Image","inputType":"text"},{"name":"token","label":"Token","inputType":"text"},{"name":"username","label":"Username","inputType":"text"},{"name":"roles","label":"Roles","inputType":"text"}]}}],"action":"/users/:username"}}},{"component":"UserList","path":"/User/userList","meta":{"component":"TableRenderer","properties":{"columns":[{"filterable":{"apply":true,"operator":"ilike"},"title":"username","dataIndex":"username"},{"filterable":{"apply":true,"operator":"ilike"},"title":"email","dataIndex":"email"},{"filterable":{"apply":true,"operator":"ilike"},"title":"firstName","dataIndex":"firstName"},{"filterable":{"apply":true,"operator":"ilike"},"title":"lastName","dataIndex":"lastName"},{"filterable":{"apply":true,"inputType":"number"},"title":"gender","dataIndex":"gender"},{"title":"Id","dataIndex":"id","key":"id"},{"title":"Age","dataIndex":"age","key":"age"},{"title":"AssignedRoles","dataIndex":"assignedRoles","key":"assignedRoles"}],"dataSourceUrl":"/users/userList"}}},{"component":"UserCreate","path":"/User/createUser","meta":{"component":"FormRenderer","properties":{"action":"/users/users","fields":[{"name":"identity","label":"Identity","inputType":"object","required":false,"properties":{"fields":[{"label":"Username","inputType":"input","required":true,"properties":{"placeholder":"Enter a unique username eg. TarnTheTireless"},"name":"username"},{"label":"Email","inputType":"input","required":true,"properties":{"placeholder":"Enter a valid email","email":true},"name":"email"},{"label":"FirstName","inputType":"input","required":true,"properties":{"placeholder":"Enter First Name"},"name":"firstName"},{"label":"LastName","inputType":"input","required":true,"properties":{"placeholder":"Enter Last Name"},"name":"lastName"},{"label":"Password","inputType":"password","required":true,"properties":{"placeholder":"Type a Secure Password"},"name":"password"},{"label":"Profile Picture","inputType":"file","required":true,"properties":{"allowedFileTypes":[".jpg",".jpeg",".png"],"maxFileSizeMB":5,"maxFileCount":1,"captureFilename":true,"captureUploadPath":true,"allowDragDrop":true,"placeholder":"Upload your profile picture","fileTypeValidationMessage":"Only JPG, JPEG, and PNG files are allowed","fileSizeValidationMessage":"File size must be less than 5MB"},"name":"profilePicture"}]}},{"name":"contactInfo","label":"ContactInfo","inputType":"object","required":false,"properties":{"fields":[{"name":"address","label":"Address","inputType":"input","required":false},{"name":"contactNo","label":"ContactNo","inputType":"object[]","required":false,"properties":{"itemFields":[]}}]}},{"name":"organizationInfo","label":"OrganizationInfo","inputType":"object","required":false,"properties":{"fields":[{"name":"organization","label":"Organization","inputType":"input","required":false},{"name":"panVatNo","label":"PanVatNo","inputType":"input","required":false}]}},{"name":"documents","label":"Documents","inputType":"object","required":false,"properties":{"fields":[{"name":"files","label":"Files","inputType":"input","required":false}]}},{"name":"accessControl","label":"AccessControl","inputType":"object","required":false,"properties":{"fields":[{"label":"User Roles","inputType":"lookup","required":false,"properties":{"fetchAction":"users/role-lookup","createAction":"lookup","allowAddNew":true,"allowSearch":true,"multiple":true,"resultMap":[{"label":"name","value":"id"}]},"name":"roles"},{"name":"groupId","label":"GroupId","inputType":"input","required":false}]}},{"name":"meta","label":"Meta","inputType":"object","required":false,"properties":{"fields":[{"name":"createdBy","label":"CreatedBy","inputType":"input","required":false}]}}],"dispatch":{"formSubmissionResponse":{},"onSuccessRedirectTo":{"component":"UserDetail","payloadNamePath":{"username":"user.username"}}}}}},{"component":"UserLogin","layout":"LoginLayout","expositionRule":{"icon":{"name":"LoginOutlined"}},"path":"/User/login","meta":{"component":"FormRenderer","properties":{"action":"/users/users/login","fields":[{"name":"email","label":"Email Address","inputType":"input","required":true,"properties":{"placeholder":"Enter email"}},{"name":"password","label":"Password","inputType":"password","required":true,"properties":{"placeholder":"Enter password"}},{"name":"rememberMe","label":"Remember Me","inputType":"checkbox","properties":{"label":"Remember Me"}}]}}}],"permissions":[]},{"name":"Category","uiComponent":[{"component":"NewCategory","path":"/Category/create","meta":{"component":"FormRenderer","properties":{"action":"/categories/save","fields":[{"name":"code","label":"Code","inputType":"input","required":false},{"name":"label","label":"Label","inputType":"input","required":false},{"name":"description","label":"Description","inputType":"input","required":false},{"name":"parentCategoryCode","label":"ParentCategoryCode","inputType":"input","required":false},{"name":"newField","label":"NewField","inputType":"input","required":false}]}}}],"permissions":[]},{"name":"Party","uiComponent":[],"permissions":[]},{"name":"Inventory","uiComponent":[{"component":"CreateInventory","path":"/Inventory/create","meta":{"component":"FormRenderer","properties":{"action":"/inventory/","fields":[{"label":"Item Name","inputType":"input","required":true,"properties":{"placeholder":"Enter item name","maxLength":255},"name":"name"},{"label":"Description","inputType":"textarea","required":false,"properties":{"placeholder":"Enter item description","rows":3},"name":"description"},{"label":"SKU","inputType":"input","required":true,"properties":{"placeholder":"Enter unique SKU","maxLength":50},"name":"sku"},{"label":"Item Type","inputType":"select","required":true,"properties":{"options":[{"label":"Perishable","value":"PERISHABLE"},{"label":"Non-Perishable","value":"NON_PERISHABLE"}]},"name":"type"},{"label":"Category","inputType":"lookup","required":true,"properties":{"fetchAction":"categories","allowSearch":true,"resultMap":[{"label":"label","value":"code"}]},"name":"categoryCode"},{"label":"Initial Stock","inputType":"number","required":true,"properties":{"placeholder":"Enter initial stock quantity","min":0},"name":"initialStock"},{"label":"Purchase Price","inputType":"number","required":true,"properties":{"placeholder":"Enter purchase price","min":0,"step":0.01},"name":"purchasePrice"},{"label":"Sale Price","inputType":"number","required":true,"properties":{"placeholder":"Enter sale price","min":0,"step":0.01},"name":"salePrice"},{"label":"Minimum Stock Level","inputType":"number","required":true,"properties":{"placeholder":"Enter minimum stock level","min":0},"name":"minimumStock"},{"label":"Unit","inputType":"input","required":false,"properties":{"placeholder":"e.g., kg, pieces, liters","maxLength":20},"name":"unit"},{"label":"Expiry Date","inputType":"date","required":false,"properties":{"placeholder":"Select expiry date (for perishable items)"},"name":"expiryDate"}]}}},{"component":"UpdateInventory","path":"/Inventory/update/:id","meta":{"component":"FormRenderer","properties":{"action":"/inventory/:id","fields":[{"label":"Item Name","inputType":"input","required":false,"properties":{"placeholder":"Enter item name","maxLength":255},"name":"name"},{"label":"Description","inputType":"textarea","required":false,"properties":{"placeholder":"Enter item description","rows":3},"name":"description"},{"label":"Item Type","inputType":"select","required":false,"properties":{"options":[{"label":"Perishable","value":"PERISHABLE"},{"label":"Non-Perishable","value":"NON_PERISHABLE"}]},"name":"type"},{"label":"Category","inputType":"lookup","required":false,"properties":{"fetchAction":"categories","allowSearch":true,"resultMap":[{"label":"label","value":"code"}]},"name":"categoryCode"},{"label":"Purchase Price","inputType":"number","required":false,"properties":{"placeholder":"Enter purchase price","min":0,"step":0.01},"name":"purchasePrice"},{"label":"Sale Price","inputType":"number","required":false,"properties":{"placeholder":"Enter sale price","min":0,"step":0.01},"name":"salePrice"},{"label":"Minimum Stock Level","inputType":"number","required":false,"properties":{"placeholder":"Enter minimum stock level","min":0},"name":"minimumStock"},{"label":"Unit","inputType":"input","required":false,"properties":{"placeholder":"e.g., kg, pieces, liters","maxLength":20},"name":"unit"},{"label":"Expiry Date","inputType":"date","required":false,"properties":{"placeholder":"Select expiry date (for perishable items)"},"name":"expiryDate"},{"label":"Active","inputType":"checkbox","required":false,"name":"isActive"}]}}},{"component":"StockAdjustment","path":"/Inventory/adjustStock","meta":{"component":"FormRenderer","properties":{"action":"/inventory/adjust-stock","fields":[{"label":"Action Type","inputType":"select","required":true,"properties":{"options":[{"label":"Stock In","value":"STOCK_IN"},{"label":"Stock Out","value":"STOCK_OUT"},{"label":"Adjustment","value":"ADJUSTMENT"},{"label":"Reserved","value":"RESERVED"},{"label":"Released","value":"RELEASED"},{"label":"Expired","value":"EXPIRED"}]},"name":"actionType"},{"label":"Quantity","inputType":"number","required":true,"properties":{"placeholder":"Enter quantity (positive for in, negative for out)"},"name":"quantity"},{"label":"Reason","inputType":"textarea","required":false,"properties":{"placeholder":"Enter reason for adjustment","rows":2},"name":"reason"},{"label":"Reference Number","inputType":"input","required":false,"properties":{"placeholder":"Enter reference number (invoice, order, etc.)","maxLength":100},"name":"referenceNumber"},{"name":"inventoryId","label":"InventoryId","inputType":"input","required":false}]}}},{"component":"CreatePurchaseOrder","path":"/Inventory/createPurchaseOrder","meta":{"component":"FormRenderer","properties":{"action":"/inventory/purchase-orders","fields":[{"label":"Order Number","inputType":"input","required":true,"properties":{"placeholder":"Enter order number","maxLength":50},"name":"orderNumber"},{"label":"Inventory Item","inputType":"lookup","required":true,"properties":{"fetchAction":"inventory","allowSearch":true,"resultMap":[{"label":"name","value":"id"}]},"name":"inventoryId"},{"label":"Quantity","inputType":"number","required":true,"properties":{"placeholder":"Enter quantity","min":1},"name":"quantity"},{"label":"Unit Price","inputType":"number","required":true,"properties":{"placeholder":"Enter unit price","min":0,"step":0.01},"name":"unitPrice"},{"label":"Supplier","inputType":"input","required":false,"properties":{"placeholder":"Enter supplier name","maxLength":255},"name":"supplier"},{"label":"Order Date","inputType":"date","required":true,"properties":{"placeholder":"Select order date"},"name":"orderDate"},{"label":"Expected Delivery Date","inputType":"date","required":false,"properties":{"placeholder":"Select expected delivery date"},"name":"expectedDeliveryDate"},{"label":"Notes","inputType":"textarea","required":false,"properties":{"placeholder":"Enter any additional notes","rows":3},"name":"notes"}]}}},{"component":"UpdatePurchaseOrder","path":"/Inventory/updatePurchaseOrder/:id","meta":{"component":"FormRenderer","properties":{"action":"/inventory/purchase-orders/:id","fields":[{"label":"Status","inputType":"select","required":false,"properties":{"options":[{"label":"Pending","value":"PENDING"},{"label":"Approved","value":"APPROVED"},{"label":"Received","value":"RECEIVED"},{"label":"Cancelled","value":"CANCELLED"}]},"name":"status"},{"label":"Actual Delivery Date","inputType":"date","required":false,"properties":{"placeholder":"Select actual delivery date"},"name":"actualDeliveryDate"},{"label":"Notes","inputType":"textarea","required":false,"properties":{"placeholder":"Enter any additional notes","rows":3},"name":"notes"}]}}}],"permissions":[]}];

    const decoded = modulePropertiesListDecoder.verify(json);
    console.log(JSON.stringify(decoded, null, 2));
  });
});
