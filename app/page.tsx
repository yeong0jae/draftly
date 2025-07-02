"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Save,
  Palette,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react"

interface DocumentData {
  type: string
  purpose: string
  audience: string
  keywords: string
  duration?: string
  tonePreset?: string
  customTone?: string
}

interface GeneratedContent {
  title: string
  structure: string[]
  content: string
  estimatedTime: string
  wordCount: number
}

interface TonePreset {
  id: string
  name: string
  description: string
  example: string
  style: {
    formality: "formal" | "casual" | "semi-formal"
    tone: "professional" | "friendly" | "authoritative" | "humble"
    structure: "detailed" | "concise" | "storytelling"
  }
}

interface PresentationState {
  isPlaying: boolean
  currentSection: number
  timeElapsed: number
  isMuted: boolean
  speed: number
}

export default function WritingAssistant() {
  const [step, setStep] = useState<"select" | "input" | "generated">("select")
  const [documentData, setDocumentData] = useState<DocumentData>({
    type: "",
    purpose: "",
    audience: "",
    keywords: "",
    duration: "",
    tonePreset: "",
    customTone: "",
  })
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedDocuments, setSavedDocuments] = useState<any[]>([])
  const [presentationState, setPresentationState] = useState<PresentationState>({
    isPlaying: false,
    currentSection: 0,
    timeElapsed: 0,
    isMuted: false,
    speed: 1,
  })
  const [tonePresets, setTonePresets] = useState<TonePreset[]>([
    {
      id: "corporate",
      name: "기업 공식",
      description: "정중하고 전문적인 기업 커뮤니케이션 톤",
      example: "안녕하세요. 저희 회사의 Q4 성과에 대해 보고드리겠습니다...",
      style: { formality: "formal", tone: "professional", structure: "detailed" },
    },
    {
      id: "startup",
      name: "스타트업",
      description: "혁신적이고 친근한 스타트업 문화 톤",
      example: "안녕하세요! 이번 스프린트에서 정말 멋진 성과를 거뒀어요...",
      style: { formality: "casual", tone: "friendly", structure: "concise" },
    },
    {
      id: "consulting",
      name: "컨설팅",
      description: "분석적이고 권위있는 컨설팅 톤",
      example: "현재 시장 상황을 분석한 결과, 다음과 같은 전략적 접근이 필요합니다...",
      style: { formality: "formal", tone: "authoritative", structure: "detailed" },
    },
  ])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const documentTypes = [
    {
      id: "presentation",
      name: "발표 대본",
      icon: "🎤",
      description: "팀 발표, 제품 소개, 결과 보고용",
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      id: "report",
      name: "공적 보고서",
      icon: "📊",
      description: "월간 리포트, 성과 분석, 제안서",
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "retrospective",
      name: "스프린트 회고",
      icon: "🔄",
      description: "프로젝트 회고, 팀 피드백, 개선안",
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      id: "greeting",
      name: "안부 인사",
      icon: "🙏",
      description: "상급자, 고객, 파트너에게 보내는 정중한 인사",
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
    },
  ]

  const handleTypeSelect = (type: string) => {
    setDocumentData({ ...documentData, type })
    setStep("input")
  }

  const generateContent = async () => {
    setIsGenerating(true)

    // 톤 프리셋 적용
    const selectedPreset = tonePresets.find((p) => p.id === documentData.tonePreset)
    const toneStyle = selectedPreset?.style || { formality: "semi-formal", tone: "professional", structure: "detailed" }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const templates = {
      presentation: {
        title: `${documentData.purpose} 발표`,
        structure: ["인사 및 소개", "현황 분석", "핵심 메시지", "실행 계획", "질의응답"],
        content: generateContentWithTone("presentation", toneStyle),
        estimatedTime: "4분 30초",
        wordCount: 450,
      },
      report: {
        title: `${documentData.purpose} 보고서`,
        structure: ["요약", "배경 및 목적", "주요 성과", "분석 결과", "향후 계획"],
        content: generateContentWithTone("report", toneStyle),
        estimatedTime: "3분 읽기",
        wordCount: 380,
      },
      retrospective: {
        title: `${documentData.purpose} 회고`,
        structure: ["프로젝트 개요", "Keep (잘한 점)", "Problem (문제점)", "Try (개선안)", "액션 아이템"],
        content: generateContentWithTone("retrospective", toneStyle),
        estimatedTime: "2분 30초 읽기",
        wordCount: 320,
      },
      greeting: {
        title: `${documentData.audience}님께 드리는 인사`,
        structure: ["정중한 인사", "안부 문의", "근황 공유", "감사 인사", "마무리 인사"],
        content: generateContentWithTone("greeting", toneStyle),
        estimatedTime: "1분 30초 읽기",
        wordCount: 280,
      },
    }

    const template = templates[documentData.type as keyof typeof templates]
    setGeneratedContent(template)
    setIsGenerating(false)
    setStep("generated")
  }

  const generateContentWithTone = (type: string, style: any) => {
    const baseTemplates = {
      presentation: {
        formal: `# ${documentData.purpose} 발표

## 1. 인사 및 소개 (30초)
존경하는 ${documentData.audience} 여러분, 안녕하십니까. 
오늘 ${documentData.purpose}에 관하여 보고드리는 시간을 갖도록 하겠습니다.

## 2. 현황 분석 (1분)
현재 상황을 면밀히 검토한 결과, ${documentData.keywords}와 관련하여 
다음과 같은 핵심 사항들을 확인할 수 있었습니다.

## 3. 핵심 메시지 (1분 30초)
${documentData.keywords}를 중심으로 한 저희의 전략적 방향성은 
다음과 같이 정리할 수 있겠습니다...

## 4. 실행 계획 (1분)
구체적인 실행 방안을 다음과 같이 제안드립니다...

## 5. 질의응답 (30초)
발표 내용에 대해 궁금한 사항이 있으시면 언제든 말씀해 주시기 바랍니다.`,
        casual: `# ${documentData.purpose} 발표

## 1. 인사 및 소개 (30초)
안녕하세요, ${documentData.audience} 여러분! 
오늘은 ${documentData.purpose}에 대해 함께 이야기해보려고 해요.

## 2. 현황 분석 (1분)
먼저 현재 상황을 살펴보면, ${documentData.keywords}와 관련해서 
정말 흥미로운 포인트들이 있어요.

## 3. 핵심 메시지 (1분 30초)
${documentData.keywords}를 중심으로 우리가 집중해야 할 부분은...

## 4. 실행 계획 (1분)
그래서 우리가 실제로 해야 할 일들을 정리해보면...

## 5. 질의응답 (30초)
궁금한 점이나 의견이 있으시면 편하게 말씀해 주세요!`,
      },
    }

    const formalityLevel = style.formality === "formal" ? "formal" : "casual"
    return baseTemplates[type as keyof typeof baseTemplates]?.[formalityLevel] || baseTemplates.presentation.formal
  }

  const saveDocument = () => {
    if (generatedContent) {
      const newDoc = {
        id: Date.now().toString(),
        title: generatedContent.title,
        content: generatedContent.content,
        type: documentData.type,
        createdAt: new Date().toISOString(),
        wordCount: generatedContent.wordCount,
      }
      setSavedDocuments([...savedDocuments, newDoc])
      alert("문서가 저장되었습니다!")
    }
  }

  const shareDocument = async () => {
    if (generatedContent && navigator.share) {
      try {
        await navigator.share({
          title: generatedContent.title,
          text: generatedContent.content,
        })
      } catch (err) {
        console.log("공유 실패:", err)
      }
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(generatedContent?.content || "")
      alert("클립보드에 복사되었습니다!")
    }
  }

  const startPresentationMode = () => {
    setPresentationState({ ...presentationState, isPlaying: true })
    intervalRef.current = setInterval(() => {
      setPresentationState((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }))
    }, 1000)
  }

  const pausePresentationMode = () => {
    setPresentationState({ ...presentationState, isPlaying: false })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetPresentationMode = () => {
    setPresentationState({
      isPlaying: false,
      currentSection: 0,
      timeElapsed: 0,
      isMuted: false,
      speed: 1,
    })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const addTonePreset = (preset: TonePreset) => {
    setTonePresets([...tonePresets, preset])
  }

  const deleteTonePreset = (id: string) => {
    setTonePresets(tonePresets.filter((p) => p.id !== id))
  }

  const resetForm = () => {
    setStep("select")
    setDocumentData({ type: "", purpose: "", audience: "", keywords: "", duration: "", tonePreset: "", customTone: "" })
    setGeneratedContent(null)
    resetPresentationMode()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (step === "select") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI 글쓰기 어시스턴트
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              브랜드 톤에 맞는
              <br />
              <span className="text-indigo-600">전문적인 문서</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              기존 문서 톤을 학습하여 일관된 브랜드 스타일로 초안을 생성해드립니다
            </p>
          </div>

          {/* Document Type Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {documentTypes.map((type) => (
              <Card
                key={type.id}
                className="group cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden"
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className={`h-1 ${type.bgColor.replace("50", "200")}`} />
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {type.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{type.name}</CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div
                    className={`w-full h-10 ${type.buttonColor} rounded-lg flex items-center justify-center text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    시작하기 →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Palette className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">브랜드 톤 학습</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">템플릿 저장</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <Play className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">발표 연습</span>
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setStep("select")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
          </div>

          <Card className="border-2 border-gray-200 bg-white overflow-hidden">
            <div className={`h-1 ${selectedType?.bgColor.replace("50", "200")}`} />

            <CardHeader className="pb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl ${selectedType?.bgColor} flex items-center justify-center text-2xl border ${selectedType?.borderColor}`}
                >
                  {selectedType?.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{selectedType?.name} 생성</CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    브랜드 톤에 맞는 구조화된 초안을 만들어드려요
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pb-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="tone">브랜드 톤</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <Label htmlFor="purpose" className="flex items-center gap-2 text-base font-medium text-gray-700">
                      <Target className="w-5 h-5 text-indigo-500" />
                      목적 (무엇에 대한 내용인가요?)
                    </Label>
                    <Input
                      id="purpose"
                      placeholder="예: Q4 마케팅 성과 분석, 신제품 런칭 전략"
                      value={documentData.purpose}
                      onChange={(e) => setDocumentData({ ...documentData, purpose: e.target.value })}
                      className="h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="audience" className="flex items-center gap-2 text-base font-medium text-gray-700">
                      <Users className="w-5 h-5 text-indigo-500" />
                      청중 (누구에게 전달하나요?)
                    </Label>
                    <Input
                      id="audience"
                      placeholder="예: 팀 리더들, 전체 직원, 경영진"
                      value={documentData.audience}
                      onChange={(e) => setDocumentData({ ...documentData, audience: e.target.value })}
                      className="h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="keywords" className="flex items-center gap-2 text-base font-medium text-gray-700">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      핵심 키워드 (쉼표로 구분)
                    </Label>
                    <Textarea
                      id="keywords"
                      placeholder="예: 매출 증가, 사용자 경험 개선, A/B 테스트, 전환율"
                      value={documentData.keywords}
                      onChange={(e) => setDocumentData({ ...documentData, keywords: e.target.value })}
                      rows={4}
                      className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg resize-none"
                    />
                  </div>

                  {documentData.type === "presentation" && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700">예상 발표 시간</Label>
                      <Select onValueChange={(value) => setDocumentData({ ...documentData, duration: value })}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-indigo-500 rounded-lg">
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
                </TabsContent>

                <TabsContent value="tone" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium text-gray-700">브랜드 톤 프리셋</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />새 프리셋
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>새 톤 프리셋 만들기</DialogTitle>
                            <DialogDescription>
                              기존 문서의 톤을 분석하여 새로운 프리셋을 만들 수 있습니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="프리셋 이름" />
                            <Textarea placeholder="기존 문서 예시를 붙여넣어 주세요..." rows={6} />
                            <Button className="w-full">프리셋 생성</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid gap-3">
                      {tonePresets.map((preset) => (
                        <Card
                          key={preset.id}
                          className={`cursor-pointer border-2 transition-all ${
                            documentData.tonePreset === preset.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setDocumentData({ ...documentData, tonePreset: preset.id })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteTonePreset(preset.id)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                            <p className="text-xs text-gray-500 italic">"{preset.example}"</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="customTone" className="text-base font-medium text-gray-700">
                        또는 기존 문서 예시 입력
                      </Label>
                      <Textarea
                        id="customTone"
                        placeholder="기존에 작성한 문서나 선호하는 문체의 예시를 입력하면 해당 톤을 학습합니다..."
                        value={documentData.customTone}
                        onChange={(e) => setDocumentData({ ...documentData, customTone: e.target.value })}
                        rows={6}
                        className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg resize-none"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={generateContent}
                disabled={!documentData.purpose || !documentData.audience || !documentData.keywords || isGenerating}
                className={`w-full h-14 text-lg font-semibold rounded-lg ${selectedType?.buttonColor} text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                    브랜드 톤 분석 및 초안 생성 중...
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={resetForm}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />새 문서 만들기
          </Button>

          <div className="flex gap-3">
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <Clock className="w-4 h-4 text-indigo-500" />
              {generatedContent?.estimatedTime}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
              {generatedContent?.wordCount}자
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-200 bg-white sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  문서 구조
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {generatedContent?.structure.map((section, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                      presentationState.currentSection === index
                        ? "bg-indigo-100 border border-indigo-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setPresentationState({ ...presentationState, currentSection: index })}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        presentationState.currentSection === index
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{section}</span>
                  </div>
                ))}

                {documentData.type === "presentation" && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>발표 시간</span>
                      <span>{formatTime(presentationState.timeElapsed)}</span>
                    </div>

                    <div className="flex gap-2">
                      {!presentationState.isPlaying ? (
                        <Button
                          size="sm"
                          onClick={startPresentationMode}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          연습 시작
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={pausePresentationMode}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          일시정지
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetPresentationMode}
                        className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setPresentationState({ ...presentationState, isMuted: !presentationState.isMuted })
                          }
                        >
                          {presentationState.isMuted ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                        <span className="text-xs text-gray-500">속도: {presentationState.speed}x</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-gray-200 bg-white">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{generatedContent?.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      브랜드 톤에 맞춰 생성된 초안입니다. 필요한 부분을 수정하여 완성하세요.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Textarea
                  value={generatedContent?.content}
                  onChange={(e) => setGeneratedContent((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  className="min-h-[600px] text-base leading-relaxed border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg resize-none font-mono"
                />

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button onClick={saveDocument} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button
                    onClick={shareDocument}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    공유하기
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    피드백 요청
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    다운로드
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
