"use client";

import { Motion } from '@/components/animate/motion'
import { TextMotion } from '@/components/animate/text-motion'
import { Boxes } from '@/components/ui/background-boxes';
import { Button } from '@/components/ui/button'
import { fromLeft } from '@/lib/motion/variants'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const WelcomeSection = () => {
  return (
    <div className="w-screen pb-10">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] z-50">
          <TextMotion text="Project management dashboard for teams" />
        </h1>
        <span className="max-w-[750px] text-center text-lg font-light text-foreground z-50">
          <TextMotion text="Create, manage, and track projects with ease." />
        </span>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6 ">
          <Motion className='z-50' variants={fromLeft} >
            <Button variant="default" asChild >
              <Link href="/signin">
                Start
                <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>
          </Motion>
        </div>
      </section>
    </div>
  )
}
