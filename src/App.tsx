import { useState } from 'react'
import { SubjectType, GradeType, UserSelection, CalculationResult, MajorGroup } from './types'
import ResultList from './components/ResultList'
import schoolsData from './data/schools.json'

function App() {
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>([])
  const [subjectGrades, setSubjectGrades] = useState<Record<string, GradeType>>({
    '语文': '' as GradeType,
    '数学': '' as GradeType,
    '外语': '' as GradeType,
    '物理': '' as GradeType,
    '化学': '' as GradeType,
    '生物': '' as GradeType,
    '历史': '' as GradeType,
    '地理': '' as GradeType,
    '政治': '' as GradeType,
    '技术': '' as GradeType,
  })
  const [results, setResults] = useState<CalculationResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const allSubjects: SubjectType[] = ['物理', '化学', '生物', '历史', '地理', '政治', '技术']
  const grades: GradeType[] = ['A', 'B', 'C', 'D', 'E']

  const handleSubjectChange = (subject: SubjectType) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
    } else if (selectedSubjects.length < 3) {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const handleGradeChange = (subject: string, grade: GradeType) => {
    setSubjectGrades(prev => ({ ...prev, [subject]: grade }))
  }

  // 计算分数
  const calculateScore = (grades: Record<string, GradeType>, school: MajorGroup): number => {
    let totalScore = 0

    Object.entries(grades).forEach(([_, grade]) => {
      switch (grade) {
        case 'A':
          totalScore += school.A_rate
          break
        case 'B':
          totalScore += school.B_rate
          break
        case 'C':
          totalScore += school.C_rate
          break
        case 'D':
          totalScore += school.D_rate
          break
        case 'E':
          totalScore += school.E_rate
          break
      }
    })

    return totalScore
  }

  // 检查选考科目是否符合要求
  const checkSubjectRequirements = (selectedSubjects: SubjectType[], requiredSubjects: SubjectType[]): boolean => {
    return requiredSubjects.every(subject => selectedSubjects.includes(subject))
  }

  const handleSubmit = () => {
    if (selectedSubjects.length !== 3) {
      alert('请选择三门选考科目')
      return
    }

    // 检查是否所有科目都已选择成绩
    const hasEmptyGrades = Object.values(subjectGrades).some(grade => !grade)
    if (hasEmptyGrades) {
      alert('请为所有科目选择学考成绩')
      return
    }

    const userSelection: UserSelection = {
      selectedSubjects,
      subjectGrades: {
        语文: subjectGrades.语文,
        数学: subjectGrades.数学,
        外语: subjectGrades.外语,
        物理: subjectGrades.物理,
        化学: subjectGrades.化学,
        生物: subjectGrades.生物,
        历史: subjectGrades.历史,
        地理: subjectGrades.地理,
        政治: subjectGrades.政治,
        技术: subjectGrades.技术,
      },
    }

    // 处理学校数据
    const schools = schoolsData as MajorGroup[]
    const calculatedResults: CalculationResult[] = []

    schools.forEach(school => {
      // 检查选考科目是否符合要求
      const subjectsMatch = checkSubjectRequirements(selectedSubjects, school.required_subjects as SubjectType[])

      // 计算总分
      const totalScore = calculateScore(subjectGrades, school)

      // 判断是否符合报考条件
      const isEligible = subjectsMatch && totalScore >= school.score

      calculatedResults.push({
        school: school.school,
        group: school.group,
        totalScore,
        isEligible
      })
    })

    // 更新结果并显示
    setResults(calculatedResults)
    setShowResults(true)
    console.log(userSelection)
  }

  const handleBack = () => {
    setShowResults(false)
  }

  // 渲染等级选择按钮
  const renderGradeSelector = (subject: string) => (
    <div key={subject} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-semibold text-gray-800">{subject}</span>
        {subjectGrades[subject] && (
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            已选: {subjectGrades[subject]}
          </span>
        )}
      </div>
      <div className="flex justify-between gap-2">
        {grades.map(grade => (
          <button
            key={grade}
            onClick={() => handleGradeChange(subject, grade)}
            className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all active:scale-95
              ${subjectGrades[subject] === grade
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-1'
                : 'bg-gray-50 text-gray-600 border border-gray-200'}`}
          >
            {grade}
          </button>
        ))}
      </div>
    </div>
  )

  // 计算各个等级的数量
  const gradeCount = Object.values(subjectGrades).reduce((acc, grade) => {
    if (grade) {
      acc[grade] = (acc[grade] || 0) + 1;
    }
    return acc;
  }, {} as Record<GradeType, number>);

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-top">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-center relative">
          {showResults && (
            <button
              onClick={handleBack}
              className="absolute left-4 p-2 -ml-2 text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          )}
          <h1 className="text-base font-bold text-gray-900">三位一体初审筛选</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {!showResults ? (
          <div className="space-y-8 animate-fade-in">
            {/* 选考科目 */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-gray-800">选考科目</h2>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  已选 {selectedSubjects.length}/3
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {allSubjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectChange(subject)}
                    disabled={!selectedSubjects.includes(subject) && selectedSubjects.length >= 3}
                    className={`aspect-[4/3] rounded-xl text-sm font-medium transition-all active:scale-95 flex flex-col items-center justify-center gap-1
                      ${selectedSubjects.includes(subject)
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-1'
                        : 'bg-white text-gray-600 border border-gray-200 shadow-sm disabled:opacity-50 disabled:bg-gray-50'}`}
                  >
                    {subject}
                    {selectedSubjects.includes(subject) && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* 学考成绩 */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">学考成绩</h2>
              <div className="space-y-3">
                {Object.keys(subjectGrades).map(subject => renderGradeSelector(subject))}
              </div>
            </section>

            {/* 底部提交栏 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-bottom z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="max-w-3xl mx-auto">
                {/* 实时信息摘要 */}
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex gap-1.5">
                    {selectedSubjects.length > 0 ? selectedSubjects.map(s => (
                      <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">{s}</span>
                    )) : <span className="text-gray-400 text-xs">请选择科目</span>}
                  </div>
                  <div className="flex gap-4">
                    {grades.map(g => (
                      <div key={g} className="flex flex-col items-center w-5">
                        <span className="text-[10px] text-gray-400 font-medium leading-none mb-1">{g}</span>
                        <span className={`text-sm font-bold leading-none ${gradeCount[g] ? 'text-gray-900' : 'text-gray-300'}`}>
                          {gradeCount[g] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
                >
                  查看结果
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ResultList
            results={results}
            selectedSubjects={selectedSubjects}
            subjectGrades={subjectGrades}
          />
        )}
      </main>
    </div>
  )
}

export default App
