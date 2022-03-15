import { mount } from '@vue/test-utils';
import StatusLegend from '@/components/explanation/status-legend.vue';

describe('Inline handling', () => {
  test('renders column wise', () => {
    const wrapper = mount(StatusLegend, {
      propsData: { showInline: false },
    });
    const container = wrapper.find('[data-testid="status-legend-container"]');
    expect(container.classes()).toEqual([]);
  });
  test('renders inline', () => {
    const wrapper = mount(StatusLegend, {
      propsData: { showInline: true },
    });
    const container = wrapper.find('[data-testid="status-legend-container"]');
    expect(container.classes()).toEqual(['flex']);
  });
});

describe('Details handling', () => {
  test('renders details', () => {
    const wrapper = mount(StatusLegend, {
      propsData: { showDetail: true },
    });
    const detail = wrapper.find('p');
    expect(detail.exists()).toBe(true);
  });
  test('does not render details', () => {
    const wrapper = mount(StatusLegend, {
      propsData: { showDetail: false },
    });
    const detail = wrapper.find('p');
    expect(detail.exists()).toBe(false);
  });
});

describe('Style handling', () => {
  test('show only selected legend', () => {
    const expectedClasses: [] = [];
    const wrapper = mount(StatusLegend, {
      propsData: { showOnly: 'ไม่พบข้อมูล' },
    });
    const text = wrapper.find('[data-testid="status-legend-text"]');
    expect(text.classes()).toEqual(expect.arrayContaining(expectedClasses));
  });
  test('show detail', () => {
    const expectedClasses = ['mr-2', 'w-24', 'mb-2'];
    const wrapper = mount(StatusLegend, {
      propsData: { showDetail: true },
    });
    const text = wrapper.find('[data-testid="status-legend-text"]');
    expect(text.classes()).toEqual(expect.arrayContaining(expectedClasses));
  });
  test('show inline without detail', () => {
    const expectedClasses = ['mr-2'];
    const wrapper = mount(StatusLegend, {
      propsData: { showDetail: false, showInline: true },
    });
    const text = wrapper.find('[data-testid="status-legend-text"]');
    expect(text.classes()).toEqual(expect.arrayContaining(expectedClasses));
  });
  test('no inline, no detail', () => {
    const expectedClasses = ['w-24'];
    const wrapper = mount(StatusLegend, {
      propsData: { showInline: true },
    });
    const text = wrapper.find('[data-testid="status-legend-text"]');
    expect(text.classes()).toEqual(expect.arrayContaining(expectedClasses));
  });
});

describe('Selection handling', () => {
  const expectedText = [
    { id: 0, text: 'ไม่พบข้อมูล' },
    { id: 1, text: 'ถูกเสนอต่อสภา' },
    { id: 2, text: 'ถูกระงับ' },
    { id: 3, text: 'กำลังดำเนินการ' },
    { id: 4, text: 'สำเร็จ' },
  ];

  test.each(expectedText)('should render "$text"', ({ id, text }) => {
    const wrapper = mount(StatusLegend, {
      propsData: { showDetail: false },
    });

    const spans = wrapper.findAll('[data-testid="status-legend-text"]');

    expect(spans.at(id).text()).toEqual(text);
  });

  test('selects one', () => {
    const expectedText = ['ไม่พบข้อมูล'];
    const wrapper = mount(StatusLegend, {
      propsData: { showDetail: false, showOnly: 'ไม่พบข้อมูล' },
    });
    const spans = wrapper.findAll('[data-testid="status-legend-text"]');
    expect(spans.length).toEqual(expectedText.length);
    expect(spans.at(0).text()).toBe(expectedText[0]);
  });
});
