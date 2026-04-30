import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import LearningFlow from './components/LearningFlow'
import GoalSection from './components/GoalSection'
import CTASection from './components/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <LearningFlow />
      <GoalSection />
      <CTASection />
    </>
  )
}
