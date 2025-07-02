"use client"

import type React from "react"

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
  Save,
  Upload,
  FileImage,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Mic,
  User,
  Presentation,
  ArrowRight,
  Plus,
} from "lucide-react"

interface SpeakerProfile {
  id: string
  name: string
  speakingStyle: {
    pace: "slow" | "normal" | "fast"
    tone: "formal" | "casual" | "energetic" | "calm"
    humor: "none" | "light" | "frequent"
    interaction: "minimal" | "moderate" | "high"
  }
  sampleSpeech?: string
  preferences: {
    useFillers: boolean
    useGestures: boolean
    useStories: boolean
    useData: boolean
  }
}

interface PresentationData {
  title: string
  audience: string
  duration: number
  context: string
  objective: string
  speakerProfile?: string
  pptSlides?: PPTSlide[]
}

interface PPTSlide {
  id: string
  slideNumber: number
  title: string
  content: string[]
  imageUrl?: string
  notes?: string
  estimatedTime: number
  script?: string
}

interface GeneratedScript {
  slides: SlideScript[]
  totalDuration: number
  speakingTips: string[]
  transitionPhrases: string[]
}

interface SlideScript {
  slideNumber: number
  title: string
  script: string
  duration: number
  keyPoints: string[]
  transitions: {
    opening: string
    closing: string
  }
}

interface PresentationState {
  isPlaying: boolean
  currentSlide: number
  timeElapsed: number
  isMuted: boolean
  speed: number
}

export default function SpeechScriptGenerator() {
  const [step, setStep] = useState<"setup" | "slides" | "generated">("setup")
  const [presentationData, setPresentationData] = useState<PresentationData>({
    title: "",
    audience: "",
    duration: 5,
    context: "",
    objective: "",
    pptSlides: [],
  })
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [presentationState, setPresentationState] = useState<PresentationState>({
    isPlaying: false,
    currentSlide: 0,
    timeElapsed: 0,
    isMuted: false,
    speed: 1,
  })
  const [speakerProfiles, setSpeakerProfiles] = useState<SpeakerProfile[]>([
    {
      id: "professional",
      name: "전문가형",
      speakingStyle: { pace: "normal", tone: "formal", humor: "light", interaction: "moderate" },
      sampleSpeech: "안녕하세요. 오늘 발표할 내용은... 데이터를 보시면 알 수 있듯이...",
      preferences: { useFillers: false, useGestures: true, useStories: false, useData: true },
    },
    {
      id: "storyteller",
      name: "스토리텔러형",
      speakingStyle: { pace: "normal", tone: "casual", humor: "frequent", interaction: "high" },
      sampleSpeech: "여러분, 이런 경험 있으시죠? 저도 처음에는... 그런데 말이죠...",
      preferences: { useFillers: true, useGestures: true, useStories: true, useData: false },
    },
    {
      id: "energetic",
      name: "에너지틱형",
      speakingStyle: { pace: "fast", tone: "energetic", humor: "frequent", interaction: "high" },
      sampleSpeech: "안녕하세요! 정말 기대되는 내용을 가져왔어요! 함께 보시죠!",
      preferences: { useFillers: true, useGestures: true, useStories: true, useData: true },
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handlePPTUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsAnalyzing(true)

    // PPT 파일 분석 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 샘플 슬라이드 생성 (실제로는 PPT 파일을 파싱)
    const sampleSlides: PPTSlide[] = [
      {
        id: "slide1",
        slideNumber: 1,
        title: "프로젝트 개요",
        content: ["프로젝트 목표", "주요 성과 지표", "팀 구성"],
        estimatedTime: 60,
        notes: "첫 슬라이드는 간단하게 소개",
      },
      {
        id: "slide2",
        slideNumber: 2,
        title: "현황 분석",
        content: ["시장 동향", "경쟁사 분석", "우리의 위치"],
        estimatedTime: 90,
        notes: "데이터 중심으로 설명",
      },
      {
        id: "slide3",
        slideNumber: 3,
        title: "핵심 전략",
        content: ["전략 1: 사용자 경험 개선", "전략 2: 시장 확대", "전략 3: 기술 혁신"],
        estimatedTime: 120,
        notes: "각 전략별로 상세 설명",
      },
      {
        id: "slide4",
        slideNumber: 4,
        title: "실행 계획",
        content: ["1분기 목표", "2분기 목표", "리소스 배분"],
        estimatedTime: 90,
        notes: "구체적인 액션 아이템 제시",
      },
      {
        id: "slide5",
        slideNumber: 5,
        title: "Q&A",
        content: ["질문과 답변", "추가 논의사항"],
        estimatedTime: 60,
        notes: "질문 받기",
      },
    ]

    setPresentationData({ ...presentationData, pptSlides: sampleSlides })
    setIsAnalyzing(false)
  }

  const generateScript = async () => {
    setIsGenerating(true)

    // 화자 프로필 적용
    const selectedProfile = speakerProfiles.find((p) => p.id === presentationData.speakerProfile)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    // 슬라이드별 대본 생성
    const slideScripts: SlideScript[] =
      presentationData.pptSlides?.map((slide, index) => {
        const isFirst = index === 0
        const isLast = index === (presentationData.pptSlides?.length || 0) - 1

        return {
          slideNumber: slide.slideNumber,
          title: slide.title,
          script: generateSlideScript(slide, selectedProfile, isFirst, isLast),
          duration: slide.estimatedTime,
          keyPoints: slide.content,
          transitions: {
            opening: isFirst ? getOpeningPhrase(selectedProfile) : getTransitionPhrase(selectedProfile),
            closing: isLast ? getClosingPhrase(selectedProfile) : getNextSlidePhrase(selectedProfile),
          },
        }
      }) || []

    const totalDuration = slideScripts.reduce((sum, slide) => sum + slide.duration, 0)

    const script: GeneratedScript = {
      slides: slideScripts,
      totalDuration,
      speakingTips: getSpeakingTips(selectedProfile),
      transitionPhrases: getTransitionPhrases(selectedProfile),
    }

    setGeneratedScript(script)
    setIsGenerating(false)
    setStep("generated")
  }

  const generateSlideScript = (slide: PPTSlide, profile?: SpeakerProfile, isFirst = false, isLast = false) => {
    const style = profile?.speakingStyle || { pace: "normal", tone: "formal", humor: "none", interaction: "minimal" }

    let script = ""

    // 오프닝
    if (isFirst) {
      if (style.tone === "casual") {
        script += `안녕하세요, ${presentationData.audience} 여러분! `
        if (style.humor !== "none") {
          script += "오늘 정말 흥미로운 내용을 준비했어요. "
        }
      } else {
        script += `안녕하십니까. 오늘 ${presentationData.title}에 대해 말씀드리겠습니다. `
      }
    }

    // 슬라이드 제목 소개
    if (style.interaction === "high") {
      script += `자, 이제 ${slide.title}에 대해 함께 살펴볼까요? `
    } else {
      script += `${slide.title}에 대해 말씀드리겠습니다. `
    }

    // 내용 설명
    slide.content.forEach((point, index) => {
      if (style.tone === "casual" && style.humor === "frequent") {
        script += `${index + 1}번째로, ${point}인데요. `
        if (profile?.preferences.useStories) {
          script += "실제로 저희가 경험한 사례를 보면... "
        }
      } else {
        script += `${index + 1}번째는 ${point}입니다. `
        if (profile?.preferences.useData) {
          script += "관련 데이터를 보시면... "
        }
      }
    })

    // 마무리
    if (isLast) {
      if (style.tone === "casual") {
        script += "이상으로 발표를 마치겠습니다. 질문 있으시면 언제든 말씀해 주세요!"
      } else {
        script += "이상으로 발표를 마치겠습니다. 감사합니다."
      }
    } else {
      script += "다음 슬라이드로 넘어가겠습니다."
    }

    return script
  }

  const getOpeningPhrase = (profile?: SpeakerProfile) => {
    const style = profile?.speakingStyle?.tone || "formal"
    if (style === "casual") return "안녕하세요! 오늘 함께할 시간이 기대되네요."
    if (style === "energetic") return "안녕하세요! 정말 흥미진진한 내용을 가져왔어요!"
    return "안녕하십니까. 오늘 소중한 시간을 내주셔서 감사합니다."
  }

  const getTransitionPhrase = (profile?: SpeakerProfile) => {
    const style = profile?.speakingStyle?.tone || "formal"
    if (style === "casual") return "자, 그럼 이제..."
    if (style === "energetic") return "다음으로 정말 중요한 부분인데요!"
    return "다음으로 말씀드릴 내용은..."
  }

  const getNextSlidePhrase = (profile?: SpeakerProfile) => {
    const style = profile?.speakingStyle?.tone || "formal"
    if (style === "casual") return "다음 슬라이드로 넘어가 볼까요?"
    if (style === "energetic") return "자, 이제 더 흥미로운 내용을 보시죠!"
    return "다음 슬라이드로 넘어가겠습니다."
  }

  const getClosingPhrase = (profile?: SpeakerProfile) => {
    const style = profile?.speakingStyle?.tone || "formal"
    if (style === "casual") return "이상으로 마치겠습니다. 궁금한 점 있으시면 편하게 질문해 주세요!"
    if (style === "energetic") return "정말 유익한 시간이었어요! 질문 있으시면 언제든지요!"
    return "이상으로 발표를 마치겠습니다. 감사합니다."
  }

  const getSpeakingTips = (profile?: SpeakerProfile) => {
    const tips = ["천천히 말하기", "아이컨택 유지하기", "핵심 포인트 강조하기"]
    if (profile?.preferences.useGestures) tips.push("적절한 제스처 활용하기")
    if (profile?.preferences.useStories) tips.push("개인 경험담 활용하기")
    return tips
  }

  const getTransitionPhrases = (profile?: SpeakerProfile) => {
    const style = profile?.speakingStyle?.tone || "formal"
    if (style === "casual") return ["그런데 말이죠", "자, 이제", "여기서 중요한 건"]
    if (style === "energetic") return ["정말 흥미로운 건", "여기서 놀라운 점은", "이제 핵심을 보시죠"]
    return ["다음으로", "또한", "마지막으로"]
  }

  const updateSlideScript = (slideNumber: number, newScript: string) => {
    if (!generatedScript) return

    const updatedSlides = generatedScript.slides.map((slide) =>
      slide.slideNumber === slideNumber ? { ...slide, script: newScript } : slide,
    )

    setGeneratedScript({ ...generatedScript, slides: updatedSlides })
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
      currentSlide: 0,
      timeElapsed: 0,
      isMuted: false,
      speed: 1,
    })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const resetForm = () => {
    setStep("setup")
    setPresentationData({
      title: "",
      audience: "",
      duration: 5,
      context: "",
      objective: "",
      pptSlides: [],
    })
    setGeneratedScript(null)
    resetPresentationMode()
  }

  if (step === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 mb-6 shadow-sm">
              <Mic className="w-4 h-4 text-blue-500" />
              AI 발표 대본 생성기
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              당신의 화법에 맞는
              <br />
              <span className="text-blue-600">맞춤형 발표 대본</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              PPT 슬라이드를 업로드하고 개인 화법을 분석하여 자연스럽고 매력적인 발표 대본을 생성해드립니다
            </p>
          </div>

          {/* Setup Form */}
          <Card className="max-w-4xl mx-auto border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">발표 정보 입력</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                발표의 기본 정보를 입력하고 PPT 파일을 업로드해주세요
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 pb-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="speaker">화자 분석</TabsTrigger>
                  <TabsTrigger value="slides">PPT 업로드</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="flex items-center gap-2 text-base font-medium text-gray-700">
                        <Presentation className="w-5 h-5 text-blue-500" />
                        발표 제목
                      </Label>
                      <Input
                        id="title"
                        placeholder="예: Q4 마케팅 성과 발표"
                        value={presentationData.title}
                        onChange={(e) => setPresentationData({ ...presentationData, title: e.target.value })}
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="audience" className="flex items-center gap-2 text-base font-medium text-gray-700">
                        <Users className="w-5 h-5 text-blue-500" />
                        청중
                      </Label>
                      <Input
                        id="audience"
                        placeholder="예: 경영진, 팀 리더들"
                        value={presentationData.audience}
                        onChange={(e) => setPresentationData({ ...presentationData, audience: e.target.value })}
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700">예상 발표 시간</Label>
                    <Select
                      onValueChange={(value) =>
                        setPresentationData({ ...presentationData, duration: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 rounded-lg">
                        <SelectValue placeholder="시간을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3분</SelectItem>
                        <SelectItem value="5">5분</SelectItem>
                        <SelectItem value="10">10분</SelectItem>
                        <SelectItem value="15">15분</SelectItem>
                        <SelectItem value="20">20분</SelectItem>
                        <SelectItem value="30">30분</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="context" className="flex items-center gap-2 text-base font-medium text-gray-700">
                      <Target className="w-5 h-5 text-blue-500" />
                      발표 상황 및 목적
                    </Label>
                    <Textarea
                      id="context"
                      placeholder="예: 분기별 성과 공유 회의에서 팀 성과를 보고하고 다음 분기 계획을 제안하는 발표"
                      value={presentationData.context}
                      onChange={(e) => setPresentationData({ ...presentationData, context: e.target.value })}
                      rows={4}
                      className="text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="speaker" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium text-gray-700">화자 프로필 선택</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />새 프로필
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>새 화자 프로필 만들기</DialogTitle>
                            <DialogDescription>
                              본인의 화법을 분석하여 맞춤형 프로필을 생성할 수 있습니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="프로필 이름" />
                            <Textarea
                              placeholder="평소 발표나 회의에서 사용하는 말투의 예시를 입력해주세요..."
                              rows={6}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>말하기 속도</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="slow">천천히</SelectItem>
                                    <SelectItem value="normal">보통</SelectItem>
                                    <SelectItem value="fast">빠르게</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>발표 톤</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="formal">정중한</SelectItem>
                                    <SelectItem value="casual">친근한</SelectItem>
                                    <SelectItem value="energetic">활기찬</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button className="w-full">프로필 생성</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid gap-4">
                      {speakerProfiles.map((profile) => (
                        <Card
                          key={profile.id}
                          className={`cursor-pointer border-2 transition-all ${
                            presentationData.speakerProfile === profile.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPresentationData({ ...presentationData, speakerProfile: profile.id })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {profile.speakingStyle.tone}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {profile.speakingStyle.pace}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">"{profile.sampleSpeech}"</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="slides" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium text-gray-700">PPT 파일 업로드</Label>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isAnalyzing ? "분석 중..." : "PPT 선택"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".ppt,.pptx,.pdf"
                        onChange={handlePPTUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">지원하는 파일 형식:</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-orange-500" />
                          <span>PowerPoint (.ppt, .pptx)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span>PDF</span>
                        </div>
                      </div>
                    </div>

                    {presentationData.pptSlides && presentationData.pptSlides.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          분석된 슬라이드 ({presentationData.pptSlides.length}개)
                        </h4>
                        <div className="grid gap-3">
                          {presentationData.pptSlides.map((slide) => (
                            <Card key={slide.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-blue-600">{slide.slideNumber}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 mb-2">{slide.title}</h5>
                                    <div className="space-y-1">
                                      {slide.content.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                      <span>예상 시간: {Math.floor(slide.estimatedTime / 60)}분</span>
                                      {slide.notes && <span>노트: {slide.notes}</span>}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => setStep("slides")}
                disabled={
                  !presentationData.title ||
                  !presentationData.audience ||
                  !presentationData.context ||
                  !presentationData.pptSlides?.length
                }
                className="w-full h-14 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowRight className="w-5 h-5 mr-3" />
                대본 생성하기
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-xl border border-gray-200 shadow-lg">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-medium">개인 화법 분석</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <Presentation className="w-5 h-5 text-blue-500" />
                <span className="font-medium">슬라이드별 대본</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <Play className="w-5 h-5 text-blue-500" />
                <span className="font-medium">발표 연습 모드</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "slides") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setStep("setup")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
          </div>

          <Card className="border-2 border-gray-200 bg-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">대본 생성 중...</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                화자 프로필과 슬라이드 내용을 분석하여 맞춤형 대본을 생성하고 있습니다
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-8">
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700">화자 프로필 적용 중...</p>
                  <p className="text-gray-700">슬라이드별 대본 생성 중...</p>
                  <p className="text-gray-700">자연스러운 전환 구문 추가 중...</p>
                </div>

                <Button
                  onClick={generateScript}
                  disabled={isGenerating}
                  className="w-full h-14 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                      대본 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      대본 생성 시작
                    </>
                  )}
                </Button>
              </div>
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
            <ArrowLeft className="w-4 h-4 mr-2" />새 발표 대본
          </Button>

          <div className="flex gap-3">
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <Clock className="w-4 h-4 text-blue-500" />
              {Math.floor((generatedScript?.totalDuration || 0) / 60)}분
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
              {generatedScript?.slides.length}개 슬라이드
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="border-2 border-gray-200 bg-white sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-blue-500" />
                    슬라이드 목록
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedScript?.slides.map((slide, index) => (
                    <div
                      key={slide.slideNumber}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        presentationState.currentSlide === index
                          ? "bg-blue-100 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setPresentationState({ ...presentationState, currentSlide: index })}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          presentationState.currentSlide === index ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                        }`}
                      >
                        {slide.slideNumber}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium text-sm">{slide.title}</span>
                        <div className="text-xs text-gray-500">{Math.floor(slide.duration / 60)}분</div>
                      </div>
                    </div>
                  ))}

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
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Current Slide Script */}
              {generatedScript && (
                <Card className="border-2 border-gray-200 bg-white">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          슬라이드 {generatedScript.slides[presentationState.currentSlide]?.slideNumber}:{" "}
                          {generatedScript.slides[presentationState.currentSlide]?.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          예상 소요 시간:{" "}
                          {Math.floor((generatedScript.slides[presentationState.currentSlide]?.duration || 0) / 60)}분
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPresentationState({
                              ...presentationState,
                              currentSlide: Math.max(0, presentationState.currentSlide - 1),
                            })
                          }
                          disabled={presentationState.currentSlide === 0}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPresentationState({
                              ...presentationState,
                              currentSlide: Math.min(
                                (generatedScript?.slides.length || 1) - 1,
                                presentationState.currentSlide + 1,
                              ),
                            })
                          }
                          disabled={presentationState.currentSlide === (generatedScript?.slides.length || 1) - 1}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Textarea
                      value={generatedScript.slides[presentationState.currentSlide]?.script || ""}
                      onChange={(e) =>
                        updateSlideScript(
                          generatedScript.slides[presentationState.currentSlide]?.slideNumber || 1,
                          e.target.value,
                        )
                      }
                      className="min-h-[300px] text-base leading-relaxed border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
                      placeholder="대본이 여기에 표시됩니다..."
                    />

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        공유하기
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        전체 대본 다운로드
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Speaking Tips */}
              {generatedScript && (
                <Card className="border-2 border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">발표 팁</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">화법 팁</h4>
                        <ul className="space-y-1">
                          {generatedScript.speakingTips.map((tip, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">전환 표현</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedScript.transitionPhrases.map((phrase, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {phrase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
