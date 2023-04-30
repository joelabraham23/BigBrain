import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import AverageTimeChart from './AverageTimeChart';

configure({ adapter: new Adapter() });

// Test doesnt work but i dont understand why :((((
describe('AverageTimeChart', () => {
  const mockData = [3.5, 4.1, 5.2, 6.3, 3.1];

	it('should render without errors', () => {
		const wrapper = shallow(<AverageTimeChart data={mockData}/>);
		expect(wrapper.exists()).toBe(true);
	});

  it('should render a chart', () => {
    const wrapper = shallow(<AverageTimeChart data={mockData}/>);
    expect(wrapper.find('Chart')).toHaveLength(1);
  });

  it('should render a chart with correct props', () => {
    const wrapper = shallow(<AverageTimeChart data={mockData}/>);
    expect(wrapper.find('Chart').prop('data')).toEqual(mockData);
    expect(wrapper.find('Chart').prop('type')).toEqual('bar');
  });

  it('should render a chart with the correct title', () => {
    const title = 'Average Time Chart';
    const wrapper = shallow(<AverageTimeChart data={mockData} title={title}/>);
    expect(wrapper.find('Chart').prop('title')).toEqual(title);
  });

	it('should render the chart with the correct data points', () => {
    const wrapper = shallow(<AverageTimeChart data={mockData}/>);
    const chartData = wrapper.find('Line').prop('data');
    expect(chartData.datasets[0].data).toEqual(mockData);
	});
	
	it('should render the chart with the correct label', () => {
    const wrapper = shallow(<AverageTimeChart data={mockData}/>);
    const chartLabel = wrapper.find('Line').prop('options').title.text;
    expect(chartLabel).toEqual('Average Time');
  });
});
