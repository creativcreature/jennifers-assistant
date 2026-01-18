'use client';

import { useState } from 'react';
import { db, initializeProfile, updateProfile } from '@/lib/db';
import Button from '@/components/ui/Button';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = 'welcome' | 'soar' | 'ssi' | 'grady' | 'snap' | 'complete';

interface Answer {
  soar: boolean | null;
  ssi: boolean | null;
  grady: boolean | null;
  snap: boolean | null;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<Answer>({
    soar: null,
    ssi: null,
    grady: null,
    snap: null,
  });

  const handleAnswer = (field: keyof Answer, value: boolean | null) => {
    setAnswers({ ...answers, [field]: value });
  };

  const nextStep = () => {
    const steps: Step[] = ['welcome', 'soar', 'ssi', 'grady', 'snap', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const finishOnboarding = async () => {
    await initializeProfile();
    await updateProfile({
      onboardingComplete: true,
      hasSOARWorker: answers.soar,
      hasAppliedSSI: answers.ssi,
      hasGradyCard: answers.grady,
      hasSNAP: answers.snap,
    });
    onComplete();
  };

  const progress = () => {
    const steps: Step[] = ['welcome', 'soar', 'ssi', 'grady', 'snap', 'complete'];
    return ((steps.indexOf(step)) / (steps.length - 1)) * 100;
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Progress Bar */}
      {step !== 'welcome' && step !== 'complete' && (
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-falcons-silver">
              Question {['soar', 'ssi', 'grady', 'snap'].indexOf(step) + 1} of 4
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress()}%` }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {step === 'welcome' && (
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-falcons-red rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">🏈</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-4">
              Welcome, Jennifer!
            </h1>
            <p className="text-lg text-falcons-silver mb-8">
              I&apos;m here to help you with benefits, housing, food, and daily life.
            </p>
            <p className="text-base text-falcons-silver mb-8">
              Let me ask a few quick questions to get started.
            </p>
            <Button onClick={nextStep}>Let&apos;s Go</Button>
          </div>
        )}

        {step === 'soar' && (
          <div className="w-full max-w-sm">
            <h2 className="font-display text-xl font-bold text-white mb-4 text-center">
              Do you have a SOAR worker helping you with benefits?
            </h2>
            <p className="text-sm text-falcons-silver mb-6 text-center">
              SOAR workers are specialists who help get SSI approved faster.
            </p>
            <div className="space-y-4">
              <Button
                variant={answers.soar === true ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('soar', true);
                  nextStep();
                }}
              >
                Yes, I have one
              </Button>
              <Button
                variant={answers.soar === false ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('soar', false);
                  nextStep();
                }}
              >
                No, not yet
              </Button>
              <button
                onClick={nextStep}
                className="w-full text-center text-falcons-silver underline py-2"
              >
                I&apos;m not sure
              </button>
            </div>
          </div>
        )}

        {step === 'ssi' && (
          <div className="w-full max-w-sm">
            <h2 className="font-display text-xl font-bold text-white mb-4 text-center">
              Have you applied for SSI or SSDI?
            </h2>
            <p className="text-sm text-falcons-silver mb-6 text-center">
              SSI provides monthly income for people with disabilities.
            </p>
            <div className="space-y-4">
              <Button
                variant={answers.ssi === true ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('ssi', true);
                  nextStep();
                }}
              >
                Yes, I applied
              </Button>
              <Button
                variant={answers.ssi === false ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('ssi', false);
                  nextStep();
                }}
              >
                No, not yet
              </Button>
              <button
                onClick={nextStep}
                className="w-full text-center text-falcons-silver underline py-2"
              >
                I&apos;m not sure
              </button>
            </div>
          </div>
        )}

        {step === 'grady' && (
          <div className="w-full max-w-sm">
            <h2 className="font-display text-xl font-bold text-white mb-4 text-center">
              Do you have a Grady Card?
            </h2>
            <p className="text-sm text-falcons-silver mb-6 text-center">
              A Grady Card gives you free medical care at Grady Hospital.
            </p>
            <div className="space-y-4">
              <Button
                variant={answers.grady === true ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('grady', true);
                  nextStep();
                }}
              >
                Yes, I have one
              </Button>
              <Button
                variant={answers.grady === false ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('grady', false);
                  nextStep();
                }}
              >
                No, I don&apos;t
              </Button>
              <button
                onClick={nextStep}
                className="w-full text-center text-falcons-silver underline py-2"
              >
                What&apos;s that?
              </button>
            </div>
          </div>
        )}

        {step === 'snap' && (
          <div className="w-full max-w-sm">
            <h2 className="font-display text-xl font-bold text-white mb-4 text-center">
              Are you getting SNAP (food stamps)?
            </h2>
            <p className="text-sm text-falcons-silver mb-6 text-center">
              SNAP provides money for food each month.
            </p>
            <div className="space-y-4">
              <Button
                variant={answers.snap === true ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('snap', true);
                  nextStep();
                }}
              >
                Yes, I get SNAP
              </Button>
              <Button
                variant={answers.snap === false ? 'primary' : 'secondary'}
                onClick={() => {
                  handleAnswer('snap', false);
                  nextStep();
                }}
              >
                No, not yet
              </Button>
              <button
                onClick={nextStep}
                className="w-full text-center text-falcons-silver underline py-2"
              >
                I applied but I&apos;m waiting
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-success/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-4">
              Great! I know what you need.
            </h1>
            <p className="text-lg text-falcons-silver mb-8">
              I&apos;ve set up your action plan based on your answers. Let&apos;s get started on your next step.
            </p>
            <Button onClick={finishOnboarding}>Start Using App</Button>
          </div>
        )}
      </div>
    </div>
  );
}
