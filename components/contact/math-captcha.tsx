"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MathCaptchaProps {
  onChange: (isValid: boolean) => void
}

export function MathCaptcha({ onChange }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Generar nuevos números aleatorios
  const generateNumbers = () => {
    setNum1(Math.floor(Math.random() * 10))
    setNum2(Math.floor(Math.random() * 10))
    setUserAnswer("")
    setIsCorrect(null)
  }

  // Inicializar al montar el componente
  useEffect(() => {
    generateNumbers()
  }, [])

  // Verificar la respuesta cuando cambia
  useEffect(() => {
    if (userAnswer === "") {
      setIsCorrect(null)
      onChange(false)
      return
    }

    const correctAnswer = num1 + num2
    const isValid = Number.parseInt(userAnswer) === correctAnswer
    setIsCorrect(isValid)
    onChange(isValid)
  }, [userAnswer, num1, num2, onChange])

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha" className="flex items-center gap-2">
        <span>
          Verificación humana: ¿Cuánto es {num1} + {num2}?
        </span>
        {isCorrect === false && <span className="text-xs text-red-500 ml-2">Respuesta incorrecta</span>}
      </Label>
      <Input
        id="captcha"
        name="captcha_answer"
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className={`${
          isCorrect === true
            ? "border-green-500 focus-visible:ring-green-500"
            : isCorrect === false
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
        }`}
        required
        aria-required="true"
        aria-invalid={isCorrect === false}
        aria-describedby={isCorrect === false ? "captcha-error" : undefined}
      />
      <input type="hidden" name="captcha_num1" value={num1} />
      <input type="hidden" name="captcha_num2" value={num2} />
      {isCorrect === false && (
        <p id="captcha-error" className="text-xs text-red-500">
          Por favor, verifica tu respuesta
        </p>
      )}
    </div>
  )
}
