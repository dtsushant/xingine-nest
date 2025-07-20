import { Test, TestingModule } from '@nestjs/testing';
import { XingineModule } from '../xingine.module';
import { XingineInspectorService } from '../xingine-inspector.service';
import { LayoutRegistryService } from '../services/layout-registry.service';

describe('LayoutRenderer System', () => {
  let module: TestingModule;
  let inspectorService: XingineInspectorService;
  let layoutRegistry: LayoutRegistryService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [XingineModule],
    }).compile();

    inspectorService = module.get<XingineInspectorService>(XingineInspectorService);
    layoutRegistry = module.get<LayoutRegistryService>(LayoutRegistryService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Layout Registry Service', () => {
    it('should be defined', () => {
      expect(layoutRegistry).toBeDefined();
    });

    it('should have pre-registered default layouts', () => {
      expect(layoutRegistry.hasLayout('default')).toBe(true);
      expect(layoutRegistry.hasLayout('login')).toBe(true);
    });

    it('should return layout names', () => {
      const names = layoutRegistry.getLayoutNames();
      expect(names).toContain('default');
      expect(names).toContain('login');
    });
  });

  describe('Inspector Service', () => {
    it('should be defined', () => {
      expect(inspectorService).toBeDefined();
    });

    it('should have getAllLayoutRenderers method', () => {
      expect(typeof inspectorService.getAllLayoutRenderers).toBe('function');
    });

    it('should return layout renderers array', () => {
      const layouts = inspectorService.getAllLayoutRenderers();
      expect(Array.isArray(layouts)).toBe(true);
    });
  });
});