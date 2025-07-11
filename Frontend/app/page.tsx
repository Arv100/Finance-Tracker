import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import {
  ChevronRight,
  PieChart,
  LineChart,
  BarChart,
  UploadCloud,
  Shield,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-950/20 dark:via-background dark:to-background"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Take control of your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  {" "}
                  financial future
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Track expenses, analyze spending patterns, and achieve your
                financial goals with our all-in-one finance management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login?signup=true">
                  <Button size="lg" className="group">
                    Get started for free
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    See how it works
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="inline-block h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 ring-2 ring-background"
                    />
                  ))}
                </div>
                <div className="text-sm leading-6">
                  <strong className="font-semibold">30k+</strong> users already
                  managing their finances
                </div>
              </div>
            </div>

            <div className="relative lg:block mx-auto lg:mx-0 w-full max-w-lg">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-cyan-400/90 rounded-xl transform transition-transform"></div>
                <Image
                  src="https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg"
                  alt="Financial dashboard preview"
                  className="mix-blend-overlay object-cover w-full h-full rounded-xl opacity-90"
                  width={600}
                  height={450}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg p-4 w-64 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">Monthly Overview</h3>
                  <span className="text-green-500 text-xs font-semibold flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
                  </span>
                </div>
                <div className="space-y-2">
                  {[40, 65, 30, 85, 45, 60, 70].map((h, i) => (
                    <div key={i} className="flex items-end space-x-1">
                      {[...Array(7)].map((_, j) => (
                        <div
                          key={j}
                          className={`h-${h / 5} w-1 rounded-full ${
                            j === i
                              ? "bg-blue-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                          style={{ height: `${h / 5}px` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful features to manage your finances
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to track, analyze, and optimize your financial
              health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <PieChart className="h-12 w-12 p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-500" />
                ),
                title: "Expense Tracking",
                description:
                  "Easily categorize and track your expenses to understand where your money is going.",
              },
              {
                icon: (
                  <LineChart className="h-12 w-12 p-2 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-500" />
                ),
                title: "Financial Reports",
                description:
                  "Get detailed reports and visualizations to analyze your spending patterns.",
              },
              {
                icon: (
                  <BarChart className="h-12 w-12 p-2 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-500" />
                ),
                title: "Budget Planning",
                description:
                  "Create and manage budgets for different categories to stay on track with your financial goals.",
              },
              {
                icon: (
                  <UploadCloud className="h-12 w-12 p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-500" />
                ),
                title: "Easy Data Import",
                description:
                  "Import transactions from CSV files or connect directly to your bank accounts.",
              },
              {
                icon: (
                  <Shield className="h-12 w-12 p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-500" />
                ),
                title: "Bank-Level Security",
                description:
                  "Your financial data is encrypted and protected with the highest security standards.",
              },
              {
                icon: (
                  <Activity className="h-12 w-12 p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-500" />
                ),
                title: "Financial Insights",
                description:
                  "Get personalized insights and recommendations to improve your financial health.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card hover:shadow-md transition-all duration-300 rounded-xl p-8 group"
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-12 overflow-hidden relative">
            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to take control of your finances?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of users who are already making smarter financial
                decisions.
              </p>
              <Link href="/login?signup=true">
                <Button size="lg" variant="secondary" className="font-medium">
                  Start your free trial
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
              <div className="w-full h-full bg-white/10 blur-3xl rounded-full transform translate-x-1/2 translate-y-1/4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  FinTrack
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Making financial management simple and effective.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "FAQ"],
              },
              {
                title: "Company",
                links: ["About us", "Blog", "Careers", "Contact us"],
              },
              {
                title: "Legal",
                links: [
                  "Terms of Service",
                  "Privacy Policy",
                  "Cookie Policy",
                  "Data Processing",
                ],
              },
            ].map((column, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm text-center">
              © {new Date().getFullYear()} FinTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
