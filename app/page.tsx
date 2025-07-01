"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  FileText,
  Users,
  Target,
  Sparkles,
  Play,
  ArrowLeft,
  Download,
  Share2,
  MessageSquare,
} from "lucide-react"

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
    {
      id: "presentation",
      name: "발표 대본",
      icon: "🎤",
      description: "팀 발표, 제품 소개, 결과 보고용",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "report",
      name: "공적 보고서",
      icon: "📊",
      description: "월간 리포트, 성과 분석, 제안서",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "retrospective",
      name: "스프린트 회고",
      icon: "🔄",
      description: "프로젝트 회고, 팀 피드백, 개선안",
      gradient: "from-emerald-500 to-teal-500",
    },
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
              <Sparkles className="w-4 h-4" />
              AI 글쓰기 어시스턴트
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
              1분 만에 완성하는
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                전문적인 문서
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              목적과 키워드만 입력하면 구조화된 초안을 즉시 생성해드립니다
            </p>
          </div>

          {/* Document Type Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {documentTypes.map((type, index) => (
              <Card
                key={type.id}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden"
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${type.gradient}`} />
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">{type.name}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div
                    className={`w-full h-12 bg-gradient-to-r ${type.gradient} rounded-lg flex items-center justify-center text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    시작하기 →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-white/60 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="font-medium">평균 10초 생성</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="font-medium">AI 기반 구조화</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">즉시 편집 가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "input") {
    const selectedType = documentTypes.find((t) => t.id === documentData.type)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="relative max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setStep("select")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
          </div>

          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${selectedType?.gradient}`} />

            <CardHeader className="pb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedType?.gradient} flex items-center justify-center text-2xl shadow-lg`}
                >
                  {selectedType?.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{selectedType?.name} 생성</CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    간단한 정보만 입력하면 구조화된 초안을 만들어드려요
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pb-8">
              <div className="space-y-3">
                <Label htmlFor="purpose" className="flex items-center gap-2 text-base font-medium text-gray-700">
                  <Target className="w-5 h-5 text-purple-500" />
                  목적 (무엇에 대한 내용인가요?)
                </Label>
                <Input
                  id="purpose"
                  placeholder="예: Q4 마케팅 성과 분석, 신제품 런칭 전략"
                  value={documentData.purpose}
                  onChange={(e) => setDocumentData({ ...documentData, purpose: e.target.value })}
                  className="h-12 text-base border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="audience" className="flex items-center gap-2 text-base font-medium text-gray-700">
                  <Users className="w-5 h-5 text-blue-500" />
                  청중 (누구에게 전달하나요?)
                </Label>
                <Input
                  id="audience"
                  placeholder="예: 팀 리더들, 전체 직원, 경영진"
                  value={documentData.audience}
                  onChange={(e) => setDocumentData({ ...documentData, audience: e.target.value })}
                  className="h-12 text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="keywords" className="flex items-center gap-2 text-base font-medium text-gray-700">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  핵심 키워드 (쉼표로 구분)
                </Label>
                <Textarea
                  id="keywords"
                  placeholder="예: 매출 증가, 사용자 경험 개선, A/B 테스트, 전환율"
                  value={documentData.keywords}
                  onChange={(e) => setDocumentData({ ...documentData, keywords: e.target.value })}
                  rows={4}
                  className="text-base border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl resize-none"
                />
              </div>

              {documentData.type === "presentation" && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">예상 발표 시간</Label>
                  <Select onValueChange={(value) => setDocumentData({ ...documentData, duration: value })}>
                    <SelectTrigger className="h-12 text-base border-gray-200 focus:border-purple-300 rounded-xl">
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
                className={`w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r ${selectedType?.gradient} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                    초안 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={resetForm}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />새 문서 만들기
          </Button>

          <div className="flex gap-3">
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full"
            >
              <Clock className="w-4 h-4 text-purple-500" />
              {generatedContent?.estimatedTime}
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full"
            >
              {generatedContent?.wordCount}자
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  문서 구조
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {generatedContent?.structure.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{section}</span>
                  </div>
                ))}

                {documentData.type === "presentation" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 rounded-lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      발표 연습 모드
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{generatedContent?.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      생성된 초안입니다. 필요한 부분을 수정하여 완성하세요.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Textarea
                  value={generatedContent?.content}
                  onChange={(e) => setGeneratedContent((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  className="min-h-[600px] text-base leading-relaxed border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl resize-none font-mono"
                />

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <Download className="w-4 h-4 mr-2" />
                    다운로드
                  </Button>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50 rounded-lg bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    공유하기
                  </Button>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50 rounded-lg bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    피드백 요청
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
