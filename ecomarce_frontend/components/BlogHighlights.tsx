import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

function BlogHighlights() {
      const blogPosts = [
    {
      title: "Top 10 Tech Gadgets for 2024",
      excerpt: "Discover the latest technology trends and must-have gadgets for this year.",
      image: "/placeholder.svg?height=200&width=300&text=Tech+Blog",
      date: "March 15, 2024",
    },
    {
      title: "Fashion Trends This Season",
      excerpt: "Stay ahead of the curve with our fashion guide for the current season.",
      image: "/placeholder.svg?height=200&width=300&text=Fashion+Blog",
      date: "March 12, 2024",
    },
    {
      title: "Home Decor Ideas on a Budget",
      excerpt: "Transform your space without breaking the bank with these creative ideas.",
      image: "/placeholder.svg?height=200&width=300&text=Home+Blog",
      date: "March 10, 2024",
    },
  ]
  return (
    <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
              <p className="text-gray-600">Stay updated with trends and tips</p>
            </div>
            <Button variant="outline">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                    <h3 className="font-semibold mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Button variant="ghost" className="p-0">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default BlogHighlights