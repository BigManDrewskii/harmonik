'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"  // Make sure you have this utility function

const effects = ['tunnel', 'vortex', 'ripple', 'spiral', 'wormhole', 'hypnotic'] as const
type Effect = typeof effects[number]

type Preset = {
  effect: Effect
  speed: number
  scale: number
  blend: number
  invert: boolean
}

const presets: Record<string, Preset> = {
  default: { effect: 'tunnel', speed: 1, scale: 1, blend: 0, invert: false },
  psychedelic: { effect: 'spiral', speed: 1.5, scale: 1.2, blend: 0.3, invert: true },
  retro: { effect: 'hypnotic', speed: 0.8, scale: 0.9, blend: 0.1, invert: false },
  cosmic: { effect: 'wormhole', speed: 1.2, scale: 1.1, blend: 0.2, invert: false },
}

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [effect, setEffect] = useState<Effect>('tunnel')
  const [speed, setSpeed] = useState(1)
  const [scale, setScale] = useState(1)
  const [blend, setBlend] = useState(0)
  const [invert, setInvert] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activePreset, setActivePreset] = useState('default')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const animate = (time: number) => {
      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let value
          switch (effect) {
            case 'tunnel':
              value = tunnel(x / width, y / height, time * speed / 1000)
              break
            case 'vortex':
              value = vortex(x / width, y / height, time * speed / 1000)
              break
            case 'ripple':
              value = ripple(x / width, y / height, time * speed / 1000)
              break
            case 'spiral':
              value = spiral(x / width, y / height, time * speed / 1000)
              break
            case 'wormhole':
              value = wormhole(x / width, y / height, time * speed / 1000)
              break
            case 'hypnotic':
              value = hypnotic(x / width, y / height, time * speed / 1000)
              break
            default:
              value = 0
          }

          value = (value + 1) / 2 // Normalize to 0-1
          value = value * scale
          value = blend * 0.5 + value * (1 - blend)
          if (invert) value = 1 - value

          const index = (y * width + x) * 4
          imageData.data[index] = value * 255
          imageData.data[index + 1] = value * 255
          imageData.data[index + 2] = value * 255
          imageData.data[index + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)

      if (isAnimating) {
        animationId = requestAnimationFrame(animate)
      }
    }

    if (isAnimating) {
      animationId = requestAnimationFrame(animate)
    } else {
      animate(0)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [effect, speed, scale, blend, invert, isAnimating])

  const handleSynthesize = () => {
    setIsAnimating(prev => !prev)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'harmonik.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const applyPreset = (presetName: string) => {
    const preset = presets[presetName]
    setEffect(preset.effect)
    setSpeed(preset.speed)
    setScale(preset.scale)
    setBlend(preset.blend)
    setInvert(preset.invert)
    setActivePreset(presetName)
  }

  const handleRandomize = () => {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)]
    const randomSpeed = Math.random() * 2
    const randomScale = Math.random() * 2
    const randomBlend = Math.random()
    const randomInvert = Math.random() > 0.5

    setEffect(randomEffect)
    setSpeed(randomSpeed)
    setScale(randomScale)
    setBlend(randomBlend)
    setInvert(randomInvert)
    setActivePreset('custom')
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-6 bg-background text-foreground">
      <div className="text-center">
        <h1 className={cn(
          "text-6xl font-extrabold tracking-tight",
          "relative inline-block",
          "transition-colors duration-300",
          "hover:text-gray-700"
        )}>
          HARMONIK
          <span className={cn(
            "absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
            "transform scale-x-0 transition-transform duration-300",
            "group-hover:scale-x-100 origin-left"
          )}></span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create Demoscene-Inspired Artworks in Real-Time
        </p>
      </div>

      <Card className="w-full max-w-3xl overflow-hidden">
        <div className="aspect-video bg-secondary relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            width={800}
            height={450}
          />
          <Button className="absolute bottom-2 right-2" size="icon" variant="secondary">
            <span className="sr-only">Fullscreen</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          </Button>
        </div>
      </Card>

      <div className="flex w-full max-w-3xl justify-between space-x-4">
        <Button onClick={handleSynthesize} className="flex-1">
          {isAnimating ? 'Stop' : 'Synthesize'}
        </Button>
        <Button onClick={handleRandomize} variant="secondary" className="flex-1">
          Randomize
        </Button>
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          Download as PNG
        </Button>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Effect Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Effect</Label>
              <Select value={effect} onValueChange={(value) => setEffect(value as Effect)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select effect" />
                </SelectTrigger>
                <SelectContent>
                  {effects.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Speed</Label>
              <Slider
                value={[speed]}
                onValueChange={([value]) => setSpeed(value)}
                max={2}
                step={0.01}
              />
            </div>
            <div className="space-y-2">
              <Label>Scale</Label>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                max={2}
                step={0.01}
              />
            </div>
            <div className="space-y-2">
              <Label>Blend</Label>
              <Slider
                value={[blend]}
                onValueChange={([value]) => setBlend(value)}
                max={1}
                step={0.01}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="invert"
                checked={invert}
                onCheckedChange={setInvert}
              />
              <Label htmlFor="invert">Invert</Label>
            </div>
            <div className="space-y-2">
              <Label>Preset</Label>
              <Select value={activePreset} onValueChange={applyPreset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(presets).map((presetName) => (
                    <SelectItem key={presetName} value={presetName}>
                      {presetName.charAt(0).toUpperCase() + presetName.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-3xl">
        <CardContent className="py-4">
          <p className="text-sm text-center text-muted-foreground">
            A Generative Web App, created and designed by Drewskii.
            <br />
            Connect on X:{' '}
            <a
              href="https://x.com/drewskii_xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              @drewskii_xyz
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function tunnel(x: number, y: number, time: number) {
  let dx = x - 0.5
  let dy = y - 0.5
  let r = Math.sqrt(dx * dx + dy * dy)
  let angle = Math.atan2(dy, dx)
  return Math.sin(r * 20 + time) * Math.cos(angle * 6 + time / 2)
}

function vortex(x: number, y: number, time: number) {
  let dx = x - 0.5
  let dy = y - 0.5
  let r = Math.sqrt(dx * dx + dy * dy)
  let angle = Math.atan2(dy, dx)
  return Math.sin(r * 10 - angle * 5 + time)
}

function ripple(x: number, y: number, time: number) {
  let dx = x - 0.5
  let dy = y - 0.5
  let r = Math.sqrt(dx * dx + dy * dy)
  return Math.sin(r * 20 - time * 2) / (r * 5 + 1)
}

function spiral(x: number, y: number, time: number) {
  let dx = x - 0.5
  let dy = y - 0.5
  let r = Math.sqrt(dx * dx + dy * dy)
  let angle = Math.atan2(dy, dx)
  return Math.sin(r * 20 + angle * 10 + time * 2)
}

function wormhole(x: number, y: number, time: number) {
  let dx = x - 0.5
  let dy = y - 0.5
  let r = Math.sqrt(dx * dx + dy * dy)
  let angle = Math.atan2(dy, dx)
  return Math.sin(1 / r + angle * 5 + time)
}

function hypnotic(x: number, y: number, time: number) {
  let dx = x - 0.5
  let dy = y - 0.5
  let r = Math.sqrt(dx * dx + dy * dy)
  return Math.sin(r * 10 + time) * Math.sin(r * 20 - time * 0.5)
}