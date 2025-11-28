
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
        logging: false,
        backgroundColor: '#ffffff'
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">没有找到符合条件的学校</p>
        <p className="text-gray-400 text-sm mt-1">请尝试调整筛选条件</p>
      </div>
    );
  }

  return (
    <div className="mt-2 animate-fade-in" id="results-container">

      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-6 sticky top-14 bg-slate-50 z-10 py-2">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showEligibleOnly}
              onChange={(e) => setShowEligibleOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">只看可报考</span>
          </label>
        </div>

        <button
          onClick={saveAsImage}
          className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存图片
        </button>
      </div>

      <div id="printable-content" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 个人信息摘要卡片 */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">选课与学考信息</h2>
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                  <span key={subject} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {(['A', 'B', 'C', 'D', 'E'] as GradeType[]).map(grade => (
                <div key={grade} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 font-medium mb-1">{grade}</span>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${gradeCount[grade] ? 'bg-white border border-gray-200 text-gray-900 shadow-sm' : 'bg-gray-50 text-gray-300'}`}>
                    {gradeCount[grade] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 结果列表 */}
        <div className="divide-y divide-gray-100">
          {Object.entries(groupedResults).map(([school, schoolResults]) => (
            <div key={school} className="p-0">
              {/* 学校标题头 */}
              <div className="bg-gray-50 px-4 py-3 border-y border-gray-100 flex items-center gap-2 sticky top-0">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="font-bold text-gray-900">{school}</h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {schoolResults.length}个专业组
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {schoolResults[0].totalScore}分
                </span>
              </div>

              {/* 专业组列表 (Mobile Cards / Desktop Table) */}
              <div className="divide-y divide-gray-50">
                {schoolResults.map((result, index) => (
                  <div key={`${school}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1 leading-snug">{result.group}</h4>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                          ${result.isEligible
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {result.isEligible ? '可报考' : '不可报考'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 二维码区域 (仅在打印/保存时显示更明显，平时隐藏或缩小) */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-3">
            <img src="/qrcode_deng.jpg" alt="二维码" className="w-32 h-32 object-contain" />
          </div>
          <p className="text-sm text-gray-500 font-medium">扫码关注更多资讯</p>
        </div>
      </div>
    </div>
  );
};

export default ResultList;