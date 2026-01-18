"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import React from "react"
import Messages from '@/messages.json'
import Autoplay from 'embla-carousel-autoplay'
import Link from "next/link"


export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    <>
    <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">Dive into the world of Anonymous Conversations</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Anonymous - Where Identity remains secret</p>
      </section>
      <Carousel  plugins={[Autoplay({delay:1500})]} className="w-full max-w-xs" >
        
      <CarouselContent>
        {Messages.map((message,index)=>(
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
        <footer className="bg-black text-white py-6 text-center">
      <div className="mb-2">
        <Link
          href="/about"
          className="mx-3 hover:text-gray-400 transition-colors duration-200"
        >
          About
        </Link>
        <Link
          href="/privacy"
          className="mx-3 hover:text-gray-400 transition-colors duration-200"
        >
          Privacy
        </Link>
        <Link
          href="/contact"
          className="mx-3 hover:text-gray-400 transition-colors duration-200"
        >
          Contact
        </Link>
      </div>
      <div className="text-gray-400 text-sm">
        © 2026 Anonymous Messages. Built with ❤️
      </div>
    </footer>

    </>
  );
}
