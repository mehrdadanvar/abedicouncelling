export interface AccordionItem {
  title: string
  body: string
}

export interface ServiceBlock {
  heading?: string
  items: AccordionItem[]
  image: string
  imageAlt: string
  imageSide: 'left' | 'right'
}

export interface FaqData {
  eyebrow: string
  title: string
  body?: string
  items: AccordionItem[]
}

export interface Approach {
  title: string
  body: string
}

export interface ServiceData {
  slug: string
  path: string
  title: string
  seoTitle: string
  description: string
  heroImage: string
  heroImageAlt: string
  paragraphs: string[]
  bullets?: string[]
  closing?: string
  blocks: ServiceBlock[]
  approachTitle: string
  faq: FaqData
}

export const approaches: Approach[] = [
  {
    title: 'Emotion-Focused Therapy',
    body: 'In EFT, we uncover the emotional patterns that shape your behaviors—those that serve you and those that hold you back. By understanding and transforming maladaptive emotions, you can break free from unhelpful cycles, respond with more balance, and build deeper, more meaningful connections with yourself and others.'
  },
  {
    title: 'S.A.F.E. EMDR',
    body: 'Somatic & Attachment Focused  EMDR is a trauma-informed approach that supports healing from complex trauma by combining EMDR with somatic awareness, attachment theory, and nervous system regulation. It helps you process overwhelming memories in a safe, connected space—making it easier to feel grounded, present, and whole.'
  },
  {
    title: 'Somatic Therapy',
    body: 'Somatic therapy recognizes that the body holds experiences that the mind alone can’t always access. Together, we’ll explore the sensations, movements, and patterns your body carries, allowing space for release, regulation, and healing. This gentle, body-centered work helps you feel more present, grounded, and connected to your inner resilience.'
  },
  {
    title: 'Art Therapy',
    body: 'Art therapy allows us to explore your emotions and experiences in a way that goes beyond words. Using creative expression, we can tap into parts of you that might be hard to reach, helping you process and heal through the power of art and imagination.'
  },
  {
    title: 'Gestalt therapy',
    body: 'Invites you to explore your thoughts, emotions, and physical sensations in the present moment. This humanistic approach emphasizes self-awareness, personal responsibility, and integrating all parts of yourself to foster healing, resolve unresolved emotions, and live authentically.'
  },
  {
    title: 'Attachment theory',
    body: 'Helps you uncover how your early relationships influence the way you connect with others today. Through this lens, we’ll work together to nurture emotional security, heal relational wounds, and create deeper, more meaningful connections in your life.'
  }
]

export const services: Record<string, ServiceData> = {
  couples: {
    slug: 'couples',
    path: '/couples-counselling',
    title: 'Couples Counselling',
    seoTitle: 'Couples Counselling - aubade counselling',
    description: 'Are you feeling lost in a cycle of tension, disconnect, and unresolved hurt, longing for a way back to each other? Feeling Stuck in Your Relationship? I',
    heroImage: '/images/service-couples-1.webp',
    heroImageAlt: 'A framed photograph of two baobab trees in a dry landscape',
    paragraphs: [
      'Are you feeling lost in a cycle of tension, disconnect, and unresolved hurt, longing for a way back to each other? Feeling Stuck in Your Relationship? I understand how difficult it is when your relationship feels stuck, leaving you alone and disconnected from the person you love most. The weight of it can feel overwhelming, like there’s no way forward. But here’s the truth:',
      'I believe in your ability to reconnect and rediscover the love you’re longing for.'
    ],
    bullets: ['Change is possible.', 'Healing is within reach.', 'You don’t have to face this alone.'],
    blocks: [
      {
        heading: 'How I Can Help',
        imageSide: 'right',
        image: '/images/service-couples-2.webp',
        imageAlt: 'Ocean waves meeting a rocky shoreline',
        items: [
          {
            title: 'Compassionate Listening:',
            body: 'I offer a safe and nonjudgmental space to truly hear both of your perspectives. Together, we can navigate even the most difficult conversations with care.'
          },
          {
            title: 'Practical Support:',
            body: 'Whether it’s conflict resolution or navigating past wounds, I provide actionable guidance to help you move forward. My goal is to empower you with tools to build trust and understanding.'
          },
          {
            title: 'Collaborative Pathfinding:',
            body: 'Relationships thrive when both partners feel seen and supported. I’ll work alongside you to create a shared vision for the future you both desire.'
          },
          {
            title: 'Be Vulnerable:',
            body: 'Feel free to share your innermost thoughts and concerns without fear of judgment. This is your space to speak openly and be heard.'
          },
          {
            title: 'Reconnect Emotionally:',
            body: 'Discover new ways to express emotions and foster emotional intimacy. Even when words feel hard, connection is always within reach.'
          },
          {
            title: 'Find Calm in Silence:',
            body: 'Sometimes, words aren’t needed. Sitting together in reflective silence can provide clarity and healing in its own way.'
          }
        ]
      },
      {
        heading: 'Together, We’ll Work Toward',
        imageSide: 'left',
        image: '/images/service-couples-3.webp',
        imageAlt: 'A potted plant casting soft striped shadows on a warm wall',
        items: [
          {
            title: 'Relief from Tension:',
            body: 'Let go of the constant stress and misunderstandings. Together, we’ll create moments of peace and ease in your relationship.'
          },
          {
            title: 'Shared Understanding:',
            body: 'Learn to see each other’s perspectives more clearly. Building empathy and mutual respect can pave the way for lasting change.'
          },
          {
            title: 'Genuine Reconnection:',
            body: 'Reignite the spark that brought you together. We’ll work on nurturing a bond that feels supportive and fulfilling. Your Relationship Can Heal Even when things feel broken, repair and growth are possible.'
          },
          {
            title: 'Rebuilding Trust:',
            body: 'Together, we’ll address past hurts and lay the foundation for a stronger, healthier connection. Trust is the cornerstone of every thriving relationship.'
          },
          {
            title: 'Aligning Your Values:',
            body: 'Rediscover what truly matters to both of you. Uncovering shared values can strengthen your sense of partnership and purpose.'
          },
          {
            title: 'Creating a Supportive Partnership:',
            body: 'Design a relationship that works for both of you. Whether it’s improved communication, shared goals, or emotional connection, we’ll tailor the process to your unique needs.'
          }
        ]
      }
    ],
    approachTitle: 'Approaches:',
    faq: {
      eyebrow: 'AUBADE COUNSELLING',
      title: 'Frequently Asked questions about Couples Counselling:',
      body: 'Taking the first step toward therapy is like planting a seed for change—an opportunity to nurture growth, healing, and a deeper connection with yourself. If you’re ready, I’m here to support you in this empowering journey.',
      items: [
        {
          title: 'Will couples therapy work if one of us isn’t fully invested?',
          body: 'Therapy works best when both partners are committed to the process, but if one partner is hesitant, we can still make progress. I’ll help you create a space where both voices are heard, and we’ll work on fostering understanding and openness. Even with one person taking the first step, therapy can create positive changes that benefit both of you.'
        },
        {
          title: 'What if we’ve tried therapy before and it didn’t work?',
          body: 'It’s not uncommon for couples to feel discouraged after a previous attempt, but each therapy journey is different. In our work together, we’ll approach your relationship from a place of deep emotional understanding and empathy, helping you uncover and transform patterns that might have been missed before. Together, we can create a fresh approach that truly speaks to your unique needs.'
        },
        {
          title: 'How will therapy help if we’ve experienced infidelity or a major betrayal?',
          body: 'Healing from betrayal takes time, but it is possible with the right support. Therapy will provide a safe, non-judgmental space to process the pain, rebuild trust, and create an open, honest dialogue. With patience and commitment, we can help you both move from hurt to healing, restoring your connection and working toward a future that feels secure and hopeful.'
        },
        {
          title: 'How do we get started?',
          body: 'We’ll start with a free 20-minute consultation. Click the link to schedule now!'
        },
        {
          title: 'Embrace your Healing Journey',
          body: 'Therapy is a process that unfolds with patience and care. I’ll be with you every step of the way, offering support as you explore your emotions, heal past wounds, and discover the strength to create the life you deserve.'
        }
      ]
    }
  },
  individual: {
    slug: 'individual',
    path: '/individual-counselling',
    title: 'Individual Counselling',
    seoTitle: 'Individual Counselling - aubade counselling',
    description: 'In this moment, by being here, you’re choosing to listen to the part of yourself that longs for relief, understanding, and change. It’s not easy to take that',
    heroImage: '/images/service-individual-1.webp',
    heroImageAlt: 'A framed photograph of a lone tree and rock formation in golden light',
    paragraphs: [
      'In this moment, by being here, you’re choosing to listen to the part of yourself that longs for relief, understanding, and change. It’s not easy to take that step, to open the door to something new; but it shows a profound strength and self-awareness, even in the midst of struggle.',
      'Together, we’ll gently uncover what you’re holding and create space for healing, clarity, and growth. You don’t need to have all the answers or even know where to begin; that’s something we’ll navigate together. This first step you’ve taken is already a powerful act of hope and possibility. When working with me, we will work hand-in-hand to explore practices that address:'
    ],
    blocks: [
      {
        imageSide: 'right',
        image: '/images/service-individual-2.webp',
        imageAlt: 'A softly lit couch with cushions and striped sunlight',
        items: [
          {
            title: 'Trauma / Complex Trauma',
            body: 'Understanding the lasting effects of past trauma and finding ways to restore safety and emotional wholeness. Healing involves creating a sense of empowerment and peace in your life.'
          },
          {
            title: 'Anxiety',
            body: 'Identifying the underlying fears and protective parts driving anxiety. The work helps you build a sense of calm, trust, and emotional resilience.'
          },
          {
            title: 'Depression and Low Mood',
            body: 'Exploring the internal struggles that contribute to depression and reconnecting with hope and vitality. This process fosters emotional clarity and renewed energy.'
          },
          {
            title: 'Anger',
            body: 'Unpacking the deeper emotions behind your anger and learning to express it in healthy, constructive ways. This work helps you understand and release pent-up frustration.'
          },
          {
            title: 'ADHD',
            body: 'Examining the emotional and internal dynamics of ADHD. This approach helps build strategies for emotional regulation, balance, and self-compassion.'
          }
        ]
      },
      {
        imageSide: 'left',
        image: '/images/service-individual-3.webp',
        imageAlt: 'A cactus with a bright orange flower in soft sunlight',
        items: [
          {
            title: 'Emotion Regulation',
            body: 'Understanding the emotions driving your reactions and developing tools for managing overwhelm. This approach helps you connect more deeply with yourself and restore emotional balance.'
          },
          {
            title: 'Narcissistic Abuse recovery',
            body: 'Healing from the emotional manipulation and self-doubt caused by toxic relationships. This process focuses on rebuilding your confidence, setting healthy boundaries, and restoring your emotional well-being.'
          },
          {
            title: 'Eating Disordered Behaviors',
            body: 'Addressing the emotional roots of your relationship with food and body image. The goal is to create space for healing, self-acceptance, and a balanced connection to nourishment.'
          },
          {
            title: 'Body Image / Self-Image',
            body: 'Challenging the self-critical narratives that shape your perceptions. This process fosters a more compassionate and accepting view of yourself.'
          },
          {
            title: 'Shame & Guilt',
            body: 'Uncovering the origins of shame and guilt, and releasing their hold on your sense of self. This helps create a foundation for healing and greater self-compassion.'
          }
        ]
      }
    ],
    approachTitle: 'Approaches:',
    faq: {
      eyebrow: 'AUBADE COUNSELLING',
      title: 'How to start Therapy :',
      body: 'Taking the first step toward therapy is like planting a seed for change—an opportunity to nurture growth, healing, and a deeper connection with yourself. If you’re ready, I’m here to support you in this empowering journey.',
      items: [
        {
          title: 'Reach Out',
          body: 'The first step is simply reaching out. Whether you choose to call, email, or fill out a contact form, it’s the beginning of creating space for change. I’m here to answer any questions you might have about the process and how therapy can support you.'
        },
        {
          title: 'Initial Consultation',
          body: 'Once you reach out, we’ll schedule a brief consultation where we can talk about what brings you to therapy and how I can support you. This is a chance for us to see if we’re a good fit for working together and to discuss your goals.'
        },
        {
          title: 'Schedule Your First Session',
          body: 'IFS invites you to connect with the different parts of yourself, even the ones you may not fully understand. These parts might be hurting, protective, or confused, and through this work, we’ll create space for healing, integration, and a sense of wholeness within yourself.'
        },
        {
          title: 'Start The Therapeutic Work',
          body: 'After our consultation, if we decide to move forward, we’ll schedule your first therapy session. This is where the real work begins—setting the stage for healing, self-discovery, and growth.'
        },
        {
          title: 'Embrace your Healing Journey',
          body: 'Therapy is a process that unfolds with patience and care. I’ll be with you every step of the way, offering support as you explore your emotions, heal past wounds, and discover the strength to create the life you deserve.'
        }
      ]
    }
  },
  family: {
    slug: 'family',
    path: '/family-therapy',
    title: 'Family Counselling',
    seoTitle: 'Family Therapy - aubade counselling',
    description: 'Do you find yourself longing for a way back to understanding and harmony, but unsure where to begin?',
    heroImage: '/images/service-family-1.webp',
    heroImageAlt: 'A framed photograph of green cactus arms against a red wall and blue sky',
    paragraphs: [
      'Do you find yourself longing for a way back to understanding and harmony, but unsure where to begin?',
      'When family relationships become strained, the impact can ripple through every part of your life. Arguments linger in the air, silences grow heavier, and the distance between loved ones feels impossible to bridge. You might find yourself replaying conversations in your mind, wondering how things got to this point, and wishing you could fix it—but not knowing how.',
      'It’s a heartbreaking place to be.'
    ],
    blocks: [
      {
        heading: 'Together, We’ll Focus On',
        imageSide: 'right',
        image: '/images/service-family-2.webp',
        imageAlt: 'Looking up through a canyon at a tree and blue sky',
        items: [
          {
            title: 'Identifying Root Causes',
            body: 'Uncover the deeper issues that fuel conflicts within your family. Understanding these patterns can bring clarity and help ease ongoing tension.'
          },
          {
            title: 'Fostering Mutual Understanding',
            body: 'Ensure every family member feels truly heard and respected. Building empathy lays the groundwork for stronger relationships and harmony.'
          },
          {
            title: 'Nurturing a Supportive Environment',
            body: 'Create a peaceful home where everyone feels safe and connected. A nurturing environment allows each family member to grow and thrive.'
          },
          {
            title: 'Addressing Your Unique Needs',
            body: 'Whether it’s emotional processing, conflict resolution tools, or space to reconnect, we’ll tailor our approach to your family’s specific challenges. I’m here to guide and support you every step of the way.'
          }
        ]
      },
      {
        heading: 'Your Family Can Heal and Thrive',
        imageSide: 'left',
        image: '/images/service-family-3.webp',
        imageAlt: 'A lemon tree beside a wooden ladder in a sunlit room',
        items: [
          {
            title: 'Rebuilding Trust',
            body: 'Trust may feel broken, but it can always be restored. With patience and effort, we’ll work to rebuild the bonds that hold your family together.'
          },
          {
            title: 'Strengthening Communication',
            body: 'Effective communication ensures everyone feels valued and heard. Together, we’ll develop tools to foster honest and respectful dialogue.'
          },
          {
            title: 'Building a Foundation of Empathy',
            body: 'Shift your family dynamic toward mutual understanding and compassion. This foundation will help your family face challenges with unity and support.'
          },
          {
            title: 'Growing Together',
            body: 'Your family has the strength to overcome these challenges. With the right guidance and time, you can emerge more connected, resilient, and ready to thrive as a team.'
          }
        ]
      }
    ],
    approachTitle: 'My Approache:',
    faq: {
      eyebrow: 'AUBADE COUNSELLING',
      title: 'Frequently Asked Questions About Family Counseling',
      items: [
        {
          title: '1. What if one of us isn’t ready to participate in therapy?',
          body: 'It’s not uncommon for some family members to feel hesitant, and that’s okay. Therapy can still be effective, even if not everyone is present initially. Starting with those who are ready can spark positive changes that encourage others to join in.'
        },
        {
          title: '2. Does everyone need to attend every session?',
          body: 'While it’s ideal to have the whole family involved, we understand that schedules and circumstances don’t always allow for it. We’ll work with whoever is able to attend, focusing on creating meaningful change that can ripple outward to the whole family.'
        },
        {
          title: '3. Can therapy help with specific issues like parenting or sibling conflict?',
          body: 'Absolutely. Whether your challenges involve parenting, sibling relationships, or other family dynamics, EFFT can help by addressing the underlying emotional needs driving the issues. We’ll work together to create practical solutions that strengthen your family’s bond.'
        },
        {
          title: '4. What if we all have different goals for therapy?',
          body: 'It’s natural for family members to have varying perspectives and priorities. In our sessions, we’ll explore each person’s needs and work to find common ground. Together, we’ll create shared goals that help everyone feel supported.'
        },
        {
          title: '5. How do we get started with family therapy?',
          body: 'We’ll begin with a free 20-minute consultation to discuss your family’s needs and challenges. Click the link to schedule now, and let’s take the first step toward healing and connection.'
        }
      ]
    }
  },
  cvap: {
    slug: 'cvap',
    path: '/cvap-counselling',
    title: 'CVAP Counselling',
    seoTitle: 'CVAP Counselling - aubade counselling',
    description: 'Have You Been Affected by Violence or Trauma?',
    heroImage: '/images/service-cvap-1.webp',
    heroImageAlt: 'A framed photograph of sunlight breaking over a mountain ridge',
    paragraphs: [
      'Have You Been Affected by Violence or Trauma?',
      'In this moment, as you explore this page, you are honoring the part of yourself that seeks understanding, relief, and a way forward. It takes immense courage to arrive here, to acknowledge your pain, and to begin considering what healing might look like.',
      'If you have been affected by violence, abuse, or a traumatic crime, it’s normal to feel as though your world has been turned upside down. You might be carrying a heavy mix of emotions: fear, anger, sadness, or a profound sense of loss. The impact can ripple through every part of your life, leaving you feeling disconnected, vulnerable, or unsure of where to turn next. But please know this: you don’t have to face this journey alone. I’m here to support you.'
    ],
    blocks: [
      {
        heading: 'How Counseling Can Help',
        imageSide: 'right',
        image: '/images/service-cvap-2.webp',
        imageAlt: 'A person sitting in a glowing canyon with a small fire',
        items: [
          {
            title: 'A Safe Space for Healing',
            body: 'Trauma recovery is deeply personal, and you don’t have to face it alone. CVAP counseling offers a secure environment where you can process your experiences and begin to rebuild.'
          },
          {
            title: 'Tailored to Your Needs',
            body: 'Every session is designed around your unique situation and goals. Together, we’ll focus on what matters most to you at your own pace.'
          },
          {
            title: 'Processing Emotions',
            body: 'Address feelings like fear, guilt, anger, or sadness in a compassionate space. We’ll work to understand and validate your emotions, helping you move toward healing.'
          },
          {
            title: 'Coping with Trauma Triggers',
            body: 'Identify the effects of trauma, such as anxiety, hypervigilance, or nightmares. We’ll develop practical strategies to manage triggers and reduce their impact on your daily life.'
          },
          {
            title: 'Rebuilding Safety and Confidence',
            body: 'Regain a sense of control and trust in yourself and your surroundings. Together, we’ll create strategies that help you feel grounded and empowered.'
          }
        ]
      },
      {
        imageSide: 'left',
        image: '/images/service-cvap-3.webp',
        imageAlt: 'Colourful cactus flowers in soft green light',
        items: [
          {
            title: 'Strengthening Resilience',
            body: 'Tap into your inner strength to rebuild hope and emotional stability. Self-compassion and resilience will guide your journey forward.'
          },
          {
            title: 'Skill-Building for Stability',
            body: 'Develop tools to manage stress, anxiety, and other challenging symptoms. These skills will support you in finding balance and calm in your life.'
          },
          {
            title: 'Creating Your Path Forward',
            body: 'Set meaningful recovery goals that align with your values and aspirations. Together, we’ll focus on empowering you to create a life of purpose and stability.'
          }
        ]
      }
    ],
    approachTitle: 'Approaches:',
    faq: {
      eyebrow: 'AUBADE COUNSELLING',
      title: 'Steps to Begin CVAP Counseling:',
      body: 'The Crime Victim Assistance Program (CVAP) is a government-funded program in British Columbia that provides financial assistance for individuals who have been victims of crime. This includes access to counseling services at no cost to you. The program aims to remove financial barriers so that survivors, witnesses, and families can focus entirely on healing and recovery.',
      items: [
        {
          title: 'Starting your journey',
          body: 'Starting your journey with CVAP counseling is simple and designed to make the process as stress-free as possible:'
        },
        {
          title: 'File a CVAP Application',
          body: 'Visit the Crime Victim Assistance Program website or contact their office to complete an application. Once approved, you’ll receive a claim number.'
        },
        {
          title: 'Reach Out With Your Claim Number',
          body: 'Contact me with your CVAP claim number, and we’ll arrange an initial consultation. During this session, we’ll discuss your needs, answer your questions, and create a plan for your counseling journey'
        },
        {
          title: 'Attend Pre-Approved Sessions:',
          body: 'CVAP typically pre-approves a set number of counseling sessions. During these sessions, we’ll focus on your immediate goals and emotional well-being.'
        }
      ]
    }
  },
  icbc: {
    slug: 'icbc',
    path: '/icbc-counseling',
    title: 'ICBC Counselling',
    seoTitle: 'ICBC Counselling - aubade counselling',
    description: 'Are You Struggling to Find Your Way After an Accident?',
    heroImage: '/images/service-icbc-1.webp',
    heroImageAlt: 'A framed photograph of an empty road curving through green hills',
    paragraphs: [
      'Are You Struggling to Find Your Way After an Accident?',
      'In the aftermath of an accident, life can feel overwhelming. You might find yourself grappling with a combination of physical pain, emotional distress, and uncertainty about the future. The ripple effects can touch every corner of your life, making even simple tasks feel insurmountable. Perhaps you feel stuck, alone, and unsure how to move forward. If you’ve found your way here, it’s because you’re searching for relief, support, and a way to reclaim your life—and that is a powerful and courageous step.',
      'Whatever you’re experiencing right now, please know this: healing is possible, and you don’t have to face this journey alone. I’m here to provide a compassionate, understanding space where you can begin to process, recover, and rebuild.'
    ],
    blocks: [
      {
        heading: 'How ICBC Counseling Can Help',
        imageSide: 'right',
        image: '/images/service-icbc-2.webp',
        imageAlt: 'White daisies glowing in soft sunlight',
        items: [
          {
            title: 'Processing Anxiety and Trauma',
            body: 'Accidents can leave lasting emotional effects, including fear and anxiety. Together, we’ll create a safe space to explore your feelings and develop strategies for managing triggers.'
          },
          {
            title: 'Managing Stress Effectively',
            body: 'Recovering from an accident often comes with overwhelming stress. We’ll work on practical tools to help you regain balance and cope with daily demands.'
          },
          {
            title: 'Rebuilding Confidence and Strength',
            body: 'An accident can shake your sense of self, but healing is possible. Our work will focus on rebuilding your inner strength and empowering you to move forward with hope.'
          },
          {
            title: 'Personalized Healing Journey',
            body: 'Your recovery is unique, and each session will be tailored to your needs. We’ll move at a pace that feels comfortable and focus on what matters most to you.'
          }
        ]
      },
      {
        heading: 'What to Expect in ICBC Counseling Sessions',
        imageSide: 'left',
        image: '/images/service-icbc-3.webp',
        imageAlt: 'A winding road seen from above through autumn trees',
        items: [
          {
            title: 'Exploring Your Emotional Experience',
            body: 'Understand the emotional and psychological impact of the accident. This reflection will help you gain clarity and take the first steps toward healing.'
          },
          {
            title: 'Developing Coping Skills',
            body: 'Learn strategies to manage pain, stress, and anxiety effectively. These tools will support you in regaining stability and improving your quality of life.'
          },
          {
            title: 'Strengthening Resilience',
            body: 'Foster self-compassion and build emotional resilience to face challenges confidently. Together, we’ll help you navigate this journey with greater strength.'
          },
          {
            title: 'Setting Recovery Goals',
            body: 'Create a personalized plan that aligns with your aspirations for healing and growth. By setting meaningful goals, you’ll reclaim your sense of direction and purpose.'
          }
        ]
      }
    ],
    approachTitle: 'Approaches:',
    faq: {
      eyebrow: 'AUBADE COUNSELLING',
      title: 'Frequently Asked Questions About ICBC Counseling',
      body: 'Taking the first step toward therapy is like planting a seed for change—an opportunity to nurture growth, healing, and a deeper connection with yourself. If you’re ready, I’m here to support you in this empowering journey.',
      items: [
        {
          title: 'What is ICBC counseling?',
          body: 'ICBC counseling provides emotional and psychological support for individuals recovering from motor vehicle accidents. It helps address challenges such as anxiety, trauma, stress, and relational difficulties that may arise after an accident.'
        },
        {
          title: 'How much does ICBC counseling cost?',
          body: 'ICBC covers the cost of pre-authorized counseling sessions, so you won’t need to pay out of pocket for these initial appointments. If additional sessions are needed, we’ll collaborate with ICBC to request further coverage.'
        },
        {
          title: 'Do I need a doctor’s referral to start counseling?',
          body: 'No, a doctor’s referral is not required. All you need is an active ICBC claim number to access counseling services.'
        },
        {
          title: 'What can I expect in counseling?',
          body: 'In our sessions, you’ll find a safe, supportive space to explore your feelings and challenges. We’ll work together using therapeutic techniques tailored to your unique needs, with a focus on helping you recover and regain balance.'
        },
        {
          title: 'What if I need more sessions than ICBC pre-authorizes?',
          body: 'If additional sessions are necessary, I’ll help request approval for more counseling sessions from ICBC. My goal is to ensure you receive the support you need without additional stress.'
        },
        {
          title: 'Take the First Step Toward Healing',
          body: 'The journey after an accident can be challenging, but you don’t have to face it alone. ICBC counseling is here to provide you with the tools, support, and understanding you need to move forward with strength and confidence. If you’re ready to begin your path to healing, reach out today to schedule your free consultation. Together, we’ll create a plan for recovery that works for you.'
        }
      ]
    }
  }
}
