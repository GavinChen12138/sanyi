import React from 'react';

interface WelcomeProps {
    onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

            <div className="flex-grow flex flex-col px-8 pt-20 pb-8 relative z-10">
                {/* Title Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-green-500 mb-2">1 分钟</h1>
                    <h2 className="text-2xl font-bold text-gray-900">了解能上的三一院校</h2>
                </div>

                {/* Divider */}
                <div className="w-8 h-1 bg-gray-800 mb-12"></div>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm mb-6">测试结束你可以获得</p>

                {/* Feature List */}
                <div className="space-y-6 mb-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-gray-800 font-medium text-lg">精准的三一院校填报名单</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-gray-800 font-medium text-lg">专属升学老师评估报告</span>
                    </div>
                </div>

                {/* Abstract Circle Graphic (Right Side) */}
                <div className="absolute right-0 top-1/3 w-48 h-96 pointer-events-none opacity-80 translate-x-1/3">
                    <svg viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="100" fill="#4ADE80" fillOpacity="0.2" />
                        <circle cx="200" cy="200" r="150" fill="#4ADE80" fillOpacity="0.1" />
                        <circle cx="200" cy="200" r="200" fill="#4ADE80" fillOpacity="0.05" />
                    </svg>
                </div>

                {/* Bottom Section */}
                <div className="mt-8">
                    <button
                        onClick={onStart}
                        className="w-full bg-green-400 text-white text-lg font-bold py-4 rounded-full shadow-lg shadow-green-200 active:scale-[0.98] transition-transform hover:bg-green-500"
                    >
                        开始测试
                    </button>
                    <p className="text-center text-gray-300 text-xs mt-4">数据基于2025年，结果仅供参考</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
