"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Users, Target, Sparkles, Play } from "lucide-react"

interface DocumentData {
  type: string
  purpose: string
  audience: string
  keywords: string
  duration?: string
}

interface GeneratedContent {
  title: string
  structure: string[]
  content: string
  estimatedTime: string
  wordCount: number
}

export default function WritingAssistant() {
  const [step, setStep] = useState<"select" | "input" | "generated">("select")
  const [documentData, setDocumentData] = useState<DocumentData>({
    type: "",
    purpose: "",
    audience: "",
    keywords: "",
    duration: "",
  })
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const documentTypes = [
    { id: "presentation", name: "발표 대본", icon: "🎤", description: "팀 발표, 제품 소개, 결과 보고용" },
    { id: "report", name: "공적 보고서", icon: "📊", description: "월간 리포트, 성과 분석, 제안서" },
    { id: "retrospective", name: "스프린트 회고", icon: "🔄", description: "프로젝트 회고, 팀 피드백, 개선안" },
  ]

  const handleTypeSelect = (type: string) => {
    setDocumentData({ ...documentData, type })
    setStep("input")
  }

  const generateContent = async () => {
    setIsGenerating(true)

    // 실제 구현에서는 AI API 호출
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const templates = {
      presentation: {
        title: `${documentData.purpose} 발표`,
        structure: ["인사 및 소개", "현황 분석", "핵심 메시지", "실행 계획", "질의응답"],
        content: `# ${documentData.purpose} 발표

## 1. 인사 및 소개 (30초)
안녕하세요, ${documentData.audience}님들. 오늘은 ${documentData.purpose}에 대해 말씀드리겠습니다.

## 2. 현황 분석 (1분)
현재 상황을 살펴보면, ${documentData.keywords}와 관련하여 다음과 같은 포인트들이 중요합니다.

## 3. 핵심 메시지 (1분 30초)
${documentData.keywords}를 중심으로 한 우리의 전략은...

## 4. 실행 계획 (1분)
구체적인 실행 방안은 다음과 같습니다...

## 5. 질의응답 (30초)
궁금한 점이 있으시면 언제든 말씀해 주세요.`,
        estimatedTime: "4분 30초",
        wordCount: 450,
      },
      report: {
        title: `${documentData.purpose} 보고서`,
        structure: ["요약", "배경 및 목적", "주요 성과", "분석 결과", "향후 계획"],
        content: `# ${documentData.purpose} 보고서

## 요약
${documentData.keywords}와 관련된 주요 성과와 향후 계획을 보고드립니다.

## 배경 및 목적
${documentData.purpose}의 배경과 목적은...

## 주요 성과
${documentData.keywords} 관련 주요 성과:
- 성과 1
- 성과 2
- 성과 3

## 분석 결과
데이터 분석 결과...

## 향후 계획
다음 단계 실행 계획...`,
        estimatedTime: "3분 읽기",
        wordCount: 380,
      },
      retrospective: {
        title: `${documentData.purpose} 회고`,
        structure: ["프로젝트 개요", "Keep (잘한 점)", "Problem (문제점)", "Try (개선안)", "액션 아이템"],
        content: `# ${documentData.purpose} 회고

## 프로젝트 개요
${documentData.purpose} 프로젝트에 대한 회고입니다.

## Keep (잘한 점)
${documentData.keywords}와 관련하여 잘 진행된 부분:
- 
- 
- 

## Problem (문제점)
개선이 필요한 부분:
- 
- 
- 

## Try (개선안)
다음에 시도해볼 방법:
- 
- 
- 

## 액션 아이템
구체적인 실행 계획:
- [ ] 액션 1
- [ ] 액션 2
- [ ] 액션 3`,
        estimatedTime: "2분 30초 읽기",
        wordCount: 320,
      },
    }

    const template = templates[documentData.type as keyof typeof templates]
    setGeneratedContent(template)
    setIsGenerating(false)
    setStep("generated")
  }

  const resetForm = () => {
    setStep("select")
    setDocumentData({ type: "", purpose: "", audience: "", keywords: "", duration: "" })
    setGeneratedContent(null)
  }

  if (step === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">글쓰기 어시스턴트 ✨</h1>
            <p className="text-gray-600">1분 만에 구조화된 초안을 받아보세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {documentTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={() => handleTypeSelect(type.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">평균 생성 시간: 10초</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "input") {
    const selectedType = documentTypes.find((t) => t.id === documentData.type)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setStep("select")}>
              ← 뒤로가기
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedType?.icon}</span>
                <div>
                  <CardTitle>{selectedType?.name} 생성</CardTitle>
                  <CardDescription>간단한 정보만 입력하면 구조화된 초안을 만들어드려요</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="purpose" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  목적 (무엇에 대한 내용인가요?)
                </Label>
                <Input
                  id="purpose"
                  placeholder="예: Q4 마케팅 성과 분석, 신제품 런칭 전략"
                  value={documentData.purpose}
                  onChange={(e) => setDocumentData({ ...documentData, purpose: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  청중 (누구에게 전달하나요?)
                </Label>
                <Input
                  id="audience"
                  placeholder="예: 팀 리더들, 전체 직원, 경영진"
                  value={documentData.audience}
                  onChange={(e) => setDocumentData({ ...documentData, audience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  핵심 키워드 (쉼표로 구분)
                </Label>
                <Textarea
                  id="keywords"
                  placeholder="예: 매출 증가, 사용자 경험 개선, A/B 테스트, 전환율"
                  value={documentData.keywords}
                  onChange={(e) => setDocumentData({ ...documentData, keywords: e.target.value })}
                  rows={3}
                />
              </div>

              {documentData.type === "presentation" && (
                <div className="space-y-2">
                  <Label htmlFor="duration">예상 발표 시간</Label>
                  <Select onValueChange={(value) => setDocumentData({ ...documentData, duration: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="시간을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3분</SelectItem>
                      <SelectItem value="5">5분</SelectItem>
                      <SelectItem value="10">10분</SelectItem>
                      <SelectItem value="15">15분</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={generateContent}
                disabled={!documentData.purpose || !documentData.audience || !documentData.keywords || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    초안 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    초안 생성하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="ghost" onClick={resetForm}>
            ← 새 문서 만들기
          </Button>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {generatedContent?.estimatedTime}
            </Badge>
            <Badge variant="secondary">{generatedContent?.wordCount}자</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 구조 사이드바 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">문서 구조</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedContent?.structure.map((section, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{section}</span>
                    </div>
                  ))}
                </div>

                {documentData.type === "presentation" && (
                  <div className="mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <Play className="w-4 h-4 mr-2" />
                      발표 연습 모드
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{generatedContent?.title}</CardTitle>
                <CardDescription>생성된 초안입니다. 필요한 부분을 수정하여 완성하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedContent?.content}
                  onChange={(e) => setGeneratedContent((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  className="min-h-[500px] font-mono text-sm"
                />

                <div className="mt-4 flex gap-2">
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    다운로드
                  </Button>
                  <Button variant="outline">공유하기</Button>
                  <Button variant="outline">피드백 요청</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
