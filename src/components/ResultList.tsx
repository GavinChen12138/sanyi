import React from 'react';
import { CalculationResult, SubjectType, GradeType } from '../types';
import html2canvas from 'html2canvas';
import { useState, useEffect } from 'react';

interface ResultListProps {
  results: CalculationResult[];
  selectedSubjects: SubjectType[];
  subjectGrades: Record<string, GradeType>;
}

const ResultList = ({ results, selectedSubjects, subjectGrades }: ResultListProps) => {
  const [showEligibleOnly, setShowEligibleOnly] = useState(true);
  const [imgStyle, setImgStyle] = useState<HTMLStyleElement | null>(null);

  // 在组件挂载时创建样式元素
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = 'img { display: initial !important; }';
    setImgStyle(style);
    return () => {
      // 组件卸载时清理
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // 计算各个等级的数量
  const gradeCount = Object.values(subjectGrades).reduce((acc, grade) => {
    if (grade) {
      acc[grade] = (acc[grade] || 0) + 1;
    }
    return acc;
  }, {} as Record<GradeType, number>);

  // 过滤结果
  const filteredResults = showEligibleOnly ? results.filter(result => result.isEligible) : results;

  // 按学校分组结果
  const groupedResults = filteredResults.reduce((groups, result) => {
    const { school } = result;
    if (!groups[school]) {
      groups[school] = [];
    }
    groups[school].push(result);
    return groups;
  }, {} as Record<string, CalculationResult[]>);

  // 保存为图片的函数
  const saveAsImage = () => {
    // 获取要截图的元素 - 只选择包含二维码和表格的内容区域
    const element = document.getElementById('printable-content');
    
    if (element && imgStyle) {
      // 添加全局样式
      document.head.appendChild(imgStyle);
      
      // 使用html2canvas将元素转换为canvas，添加配置以修复文字偏移
      html2canvas(element as HTMLElement, {
        scrollY: -window.scrollY,
        useCORS: true,
        scale: 2,
        logging: false
      }).then(canvas => {
        // 将canvas转换为图片URL
        const image = canvas.toDataURL('image/png');
        
        // 移除全局样式
        if (imgStyle.parentNode) {
          imgStyle.parentNode.removeChild(imgStyle);
        }
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `院校报考结果-${new Date().toLocaleDateString()}.png`;
        link.href = image;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">没有找到符合条件的学校</p>
      </div>
    );
  }

  return (
    <div className="mt-6" id="results-container">
      <div className="flex flex-col gap-4 mb-4">
        <button
          onClick={saveAsImage}
          className="w-auto sm:w-48 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存为图片
        </button>
      </div>
      <div id="printable-content" className="p-12 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-center mb-6">
          <img src="/qrcode_deng.jpg" alt="二维码" className="h-180 w-80" />
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">选课与学考信息</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">选考科目：</span>
                <div className="flex gap-2">
                  {selectedSubjects.map((subject) => (
                    <span key={subject} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">等级统计：</span>
                <div className="flex gap-2">
                  {(['A', 'B', 'C', 'D', 'E'] as GradeType[]).map(grade => (
                    <span key={grade} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {grade}：{gradeCount[grade] || 0}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">三一院校</h2>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showEligibleOnly}
                onChange={(e) => setShowEligibleOnly(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">只看可报考</span>
            </label>
          </div>
        </div>
        {/* 桌面端表格视图 - 在中等屏幕及以上显示 */}
        <div className="hidden md:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">学校</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">专业组</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">折算分</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {Object.entries(groupedResults).map(([school, schoolResults]) => (
                schoolResults.map((result, index) => (
                  <tr key={`${school}-${index}`} className={index === 0 ? "border-t-2 border-gray-300" : ""}>
                    {index === 0 ? (
                      <td 
                        rowSpan={schoolResults.length} 
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-top"
                      >
                        {school}
                      </td>
                    ) : null}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{result.group}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{result.totalScore}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${result.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.isEligible ? '可报考' : '不可报考'}
                      </span>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 移动端表格视图 */}
        <div className="md:hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-gray-900">学校与专业组</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900">折算分与状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {Object.entries(groupedResults).map(([school, schoolResults]) => (
                <React.Fragment key={`mobile-${school}`}>
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-xs font-bold text-gray-900">
                      {school}
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-xs text-gray-500">
                      {schoolResults[0].totalScore}
                    </td>
                  </tr>
                  {schoolResults.map((result, index) => (
                    <tr key={`mobile-${school}-${index}`}>
                      <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-500 pl-8 italic">{result.group}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${result.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {result.isEligible ? '可报考' : '不可报考'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultList;