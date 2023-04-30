import React from 'react';
import { shallow } from 'enzyme';
import PercentageBarChart from './PercentageBarChart';

describe('PercentageBarChart', () => {
  const mockData = [
    { question: 'Question 1', percentage: 60 },
    { question: 'Question 2', percentage: 40 },
    { question: 'Question 3', percentage: 80 },
  ];

  it('should render without errors', () => {
    const wrapper = shallow(<PercentageBarChart data={mockData} />);
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should contain a canvas element', () => {
    const wrapper = shallow(<PercentageBarChart data={mockData} />);
    expect(wrapper.find('canvas')).toHaveLength(1);
  });

  it('should display the correct number of bars', () => {
    const wrapper = shallow(<PercentageBarChart data={mockData} />);
    const bars = wrapper.find('canvas').first().props().data.datasets[0].data;
    expect(bars).toHaveLength(mockData.length);
  });

  it('should display the correct percentages for each question', () => {
    const wrapper = shallow(<PercentageBarChart data={mockData} />);
    const bars = wrapper.find('canvas').first().props().data.datasets[0].data;
    expect(bars).toEqual(mockData.map(d => d.percentage));
  });

  it('should create a chart when data is provided', () => {
    const wrapper = mount(<PercentageBarChart data={mockData} />);
    expect(wrapper.find('canvas').instance().getContext).toBeDefined();
  });

  it('should not create a chart when no data is provided', () => {
    const wrapper = mount(<PercentageBarChart data={[]} />);
    expect(wrapper.find('canvas').instance().getContext).toBeUndefined();
  });
});