import { useState, useEffect } from 'react'
import { SubjectType, GradeType, UserSelection, CalculationResult, MajorGroup } from './types'
import ResultList from './components/ResultList'
import schoolsData from './data/schools.json'

function App() {
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>([])
  const [subjectGrades, setSubjectGrades] = useState<Record<string, GradeType>>({
    '语文': '',
    '数学': '',
    '外语': '',
    '物理': '',
    '化学': '',
    '生物': '',
    '历史': '',
    '地理': '',
    '政治': '',
    '技术': '',
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
    const hasEmptyGrades = Object.values(subjectGrades).some(grade => grade === '')
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

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="flex-grow w-full flex justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          {!showResults ? (
            <div className="w-full max-w-5xl mx-auto bg-white sm:bg-white sm:rounded-lg sm:shadow-lg p-6 sm:p-8 lg:p-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">浙江省三位一体初审入围筛选系统</h1>
              
              {/* 科目选择区块 */}
              <div className="mb-8 sm:mb-10">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">选择三门选考科目</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {allSubjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => handleSubjectChange(subject)}
                      className={`p-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                        ${selectedSubjects.includes(subject)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* 成绩设置区块 */}
              <div className="mb-8 sm:mb-10">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">学考成绩</h2>
                <div className="space-y-4">
                  {Object.keys(subjectGrades).map(subject => (
                    <div key={subject} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm sm:text-base text-gray-700">{subject}</span>
                      <div className="flex gap-1 sm:gap-2">
                        {grades.map(grade => (
                          <button
                            key={grade}
                            onClick={() => handleGradeChange(subject, grade)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center justify-center
                              ${subjectGrades[subject] === grade
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-64"
                >
                  提交选择
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl mx-auto bg-white sm:bg-white sm:rounded-lg sm:shadow-lg p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col items-center mb-6">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-300 transition-colors sm:w-48"
                >
                  返回修改
                </button>
              </div>
              
              <ResultList 
                results={results} 
                selectedSubjects={selectedSubjects}
                subjectGrades={subjectGrades}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
