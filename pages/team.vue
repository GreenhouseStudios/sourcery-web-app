<template>
    <div id="page-team">
        <v-container>
            <h1 class="text-center my-16 text-h3 font-weight-medium">Meet the Team</h1>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <template v-for="member in members">
                        <v-row align="center">
                            <v-col cols="6" md="3">
                                <v-img :src="'/img/team/' + member.image" lazy-src="/img/team/team-placeholder.jpg" cover height="188" width="152" rounded="lg" />
                            </v-col>
                            <v-col cols="12" md="9">
                                <h2 class="text-h4">{{ member.name }}</h2>
                                <p class="text-h6 text-primary">{{ member.title }}</p>
                                <p>{{ member.bio }}</p>
                            </v-col>
                            <v-divider class="my-12" />
                        </v-row>
                    </template>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <h2 class="text-h4 mb-8">Consulting Partners</h2>
                    <v-row>
                        <v-col cols="6" md="4" v-for="member in alumni">
                            <v-img :src="'/img/team/' + member.image" lazy-src="/img/team/team-placeholder.jpg" cover height="188" width="152" rounded="lg" />
                            <h2 class="text-h6">{{ member.name }}</h2>
                            <p class="text-primary">{{ member.title }}</p>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'public'
});

const members = ref([
    {
        name: 'Tom Scheinfeldt',
        title: 'PI / Project Director',
        image: 'scheinfeldt.jpg',
        bio: 'Tom Scheinfeldt is Associate Professor of Digital Humanities at the University of Connecticut where he holds a joint appointment in the Department of Digital Media & Design and the Department of History. He is also Director of Greenhouse Studios (greenhousestudios.uconn.edu), a transdisciplinary research unit that solves the problems and explores the opportunities of scholarship in the "digital age." Formerly Managing Director of the Roy Rosenzweig Center for History and New Media at George Mason University, Tom has directed several award-winning digital humanities and academic software projects, including Omeka, THATCamp, and the September 11 Digital Archive. You can follow Tom on Twitter at @foundhistory.'
    },
    {
        name: 'Brian Daley',
        title: 'Co-PI / Lead Developer',
        image: 'daley.jpg',
        bio: 'For nearly 20 years, Brian has been creating for web and mobile platforms as a freelancer and a web developer with University Communications at the University of Connecticut. His work includes projects like the UConn homepage and UConn Health, as well as many other high-profile digital marketing campaigns and websites.'
    },
    {
        name: 'Sara Sikes',
        title: 'Co-I/Senior Strategist',
        image: 'sikes.jpg',
        bio: 'Sara Sikes, MA, is the Associate Director of Greenhouse Studios. She joined the Library staff at the University of Connecticut in 2016, and her career includes positions in museums, academic publishing, public history institutions and research libraries.'
    },
    {
        name: 'Amanda Breeden',
        title: 'Project Lead',
        image: 'breeden.jpg',
        bio: "Originally trained as an archivist, Amanda (she/her) functions as a project lead for Greenhouse Studios' archival document delivery app, Sourcery. She has a range of experience in archives, libraries, and museums. Hailing from North Carolina, she earned her BA in History from the University of North Carolina at Asheville and her MLS from the University of North Carolina at Chapel Hill with a concentration in Archives and Records Management. Amanda also currently works part-time at the New Haven Free Public Library as a Reference Librarian."
    },
    {
        name: 'Brian Kelleher',
        title: 'Developer',
        image: 'kelleher.jpg',
        bio: 'Prior to working for the Digital Experience Group, Brian worked as a web developer for University Communications at UConn, where he created and managed WordPress websites such as the premier news website UConn Today.  Brian was also the principle web developer for a live-streaming video startup where he created web and native mobile applications, and worked extensively with emerging cloud technology.'
    },
    {
        name: 'Brooke Foti Gemmell',
        title: 'Lead Designer',
        image: 'gemmell.jpg',
        bio: 'Brooke Foti Gemmell is a Design Technologist at Greenhouse Studios, an interdisciplinary research unit which aims to reframe the workflows of collaborative scholarly production. With a background in visual arts and design, Brooke is a creative producer and visual problem solver on Greenhouse Studios projects, and also works on the branding and outreach of Greenhouse Studios at large. She holds a B.F.A in Studio Arts and is an M.A. candidate in Digital Media & Design at the University of Connecticut. Her areas of specialty include communications design, branding, photography, and book arts.'
    }
])


const alumni = ref([
    {
        name: 'Carly Wanner-Hyde',
        title: 'Project Lead / Head Designer',
        image: 'wanner-hyde.jpg',
        bio: 'Carly is a Design Technologist at Greenhouse Studios, an interdisciplinary research unit which aims to reframe the workflows of collaborative scholarly production. She holds a BFA in Digital Media and Design with a concentration in 3D Animation from the University of Connecticut. She is passionate about using her creative platform to amplify the voices and experiences of others through digital mediums. She specializes in team leadership, communication design, and fine arts. In her free time, she enjoys rock climbing, playing outside with her dog Momo, and creating things.'
    },
    {
        name: 'Raven Morris',
        title: 'Graduate Research Assistant',
        image: 'raven-morris.jpg',
        bio: 'Raven (she/her) studied engineering and computer science before jumping into digital media design, where she will focus on bringing characters and worlds to life through animation and extended reality. She aspires to tell imaginative and impactful stories through a Black lens, and enjoys reading and writing in her spare time. An avid Studio Ghibli fan, she hopes to travel to Japan someday.'
    },
    {
        name: 'Lauren Harland',
        title: 'Undergraduate Research Assistant',
        image: 'harland.jpg',
        bio: 'Lauren is a designer and strategist with a love for teaming up with fellow creatives to make meaningful work. She\'s interested in many facets of her field, including graphic design, project management, branding, and marketing strategy. She is currently a senior at UConn studying design, digital business strategies, and entrepreneurship. In her free time, you can find her cooking, reading, or in the student section at Gampel Pavilion.'
    },
    {
        name: 'Jailyn Murphy',
        title: 'Undergraduate Research Assistant',
        image: 'murphy.jpg',
        bio: 'Jailyn (she/her) is a digital media enthusiast who has a particular interest in social media data analysis. She has a passion for design that serves a clear purpose and targets its audience successfully. Digital history is another topic of interest for her because of the influence her father, a US History teacher, has on her. She hopes to work in advertising in Boston, MA soon after college. Additionally, she coaches a professional hip-hop competition team and has a love for cooking.'
    },
    {
        name: 'Lauren Ciulla',
        title: 'Design Intern',
        image: 'ciulla.jpg'
    },
    {
        name: 'Emmet de Barra',
        title: 'Graduate Assistant',
        image: 'barra.jpg'
    },
    {
        name: 'Eri Lauer',
        title: 'Design Intern',
        image: 'lauer.jpg'
    },
    {
        name: 'Shunyi Li',
        title: 'Social Media Assistant',
        image: 'li.jpg'
    },
    {
        name: 'Elijah Matthews',
        title: 'Design Intern',
        image: 'matthews.jpg'
    },
    {
        name: 'Tim Morris',
        title: 'Developer',
        image: 'morris.jpg'
    },
    {
        name: 'Lily Pashapour',
        title: 'Design Intern',
        image: 'pashapour.jpg'
    },
    {
        name: 'Sophia Valentin',
        title: 'Social Media Assistant',
        image: 'valentin.jpg'
    },
    {
        name: 'Wenchao Lou',
        title: 'UI/UX Designer',
        image: 'lou.jpg',
        bio: 'Wenchao Lou is a Digital Media & Design major student at the University of Connecticut. Within the Digital Media & Design program, she concentrates in Game Design. She has experience in video production, web design, UI/UX design and game design.'
    },
    {
        name: 'Samson Weiner',
        title: 'Developer',
        image: 'weiner.jpg',
        bio: 'Samson joined the Sourcery team in the Fall of 2018 while an undergraduate. He is continuing his studies as a graduate student at the University of Connecticut studying computer science. His main area of research involves applying algorithms to evolutionary and biological problems, though his interests extend to computational theory as a whole. Outside of research and Sourcery, Samson enjoys exploring new media outlets and technology. His favorite quarantine activities have been cooking, reading, and art.'
    },
    {
        name: 'Alex Mueller',
        title: 'UX Designer & Developer',
        image: 'mueller.jpg',
        bio: 'Alex Mueller is a senior studying Digital Media and Design with a concentration in Web and Interactive Media. He has loved doing design work as a hobby for the past 5 years and is looking forward to pursuing design as a career. He also has been interested in programming since he was a child and likes to combine both his design and development skills wherever he can. Outside of school, he enjoys playing the drums and photography.'
    },
    {
        name: 'Greg Colati',
        title: 'Co-I/Senior Strategist',
        image: 'colati.jpg',
        bio: 'Greg Colati is the Director of the Digital Preservation Repository Program at UConn, as well as the head of the Connecticut Digital Archive, a statewide preservation-oriented digital repository service for libraries, archives, museums, and memory institutions. Mr. Colati has more than 25 years  experience in archives and cultural heritage institutions. He is currently an adjunct Professor UConn\'s department of Digital Media and Design and has taught courses in archives management and digital repositories at Simmons University GSLIS, the University of Denver and for the Society of American Archivists.'
    },
    {
        name: 'Wes Hamrick',
        title: 'Business Manager',
        image: 'hamrick.jpg',
        bio: 'Wes Hamrick is a postdoctoral fellow at Greenhouse Studios at the University of Connecticut, where he serves as project manager on a number of digital humanities projects, including an AR (augmented reality) experience, the document delivery app Sourcery, and a digital game for learning Early Modern Irish. He specialises in British and Irish literature of the long eighteenth century.'
    },
    {
        name: 'Garrett McComas',
        title: 'Outreach Coordinator',
        image: 'mccomas.jpg',
        bio: 'Garrett McComas has a MLIS from University of Illinois at Urbana-Champaign and began working at Greenhouse Studios in 2020. He enjoys creating sustainable digital humanities projects with researchers and libraries. As a part of the Sourcery team, he leverages his background as a researcher and his experiences working with libraries and archives to work on Community Outreach for the project.'
    }
])
</script>