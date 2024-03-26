<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <sourcery-card title="FAQ">
        <v-expansion-panels flat tile>
          <v-expansion-panel
            v-for="(item,i) in items"
            color="transparent"
          >
            <v-expansion-panel-header class="text-h6">
              {{ item.question }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="mt-2">
              <div v-if="item.answer">
                {{ item.answer }}
              </div>
              <!-- who are we -->
              <div v-if="item.answer_link">
                {{ item.answer_link }} <a href="https://greenhousestudios.uconn.edu/">{{ item.answer_link01 }}</a> {{ item.answer_link02 }} <a href="https://greenhousestudios.uconn.edu/projects/">{{ item.answer_link03 }}</a> {{ item.answer_link04 }}
              </div>
              <!-- when is sourcery coming -->
              <div v-if="item.answer_link1">
                {{ item.answer_link1 }} <a href="https://sourceryapp.org/">{{ item.answer_link2 }}</a> {{ item.answer_link3 }}
              </div>
              <div v-if="item.answer2">
                {{ item.answer2 }}
              </div>
              <div v-if="item.answer3">
                {{ item.answer3 }}
              </div>
              <div v-if="item.answer4">
                {{ item.answer4 }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import SourceryCard from '@/components/card-with-header.vue'

export default {
    name: 'FAQ',
    components: {
        SourceryCard
    },
    data () {
        return {
            items: [
                {
                    question: 'What is Sourcery?',
                    answer: 'Sourcery aims to improve the systems and technologies whereby researchers access not-yet digitized archival documents. With the Sourcery app installed on a phone or laptop, a researcher seeking a document can simply type the required document’s location information into the Sourcery application and other researchers in place near those documents can retrieve them. Using geolocation services, the app finds Sourcery-registered researchers currently working in and around the repository where the document sits. Using push notifications to their smartphones, Sourcery notifies these remote researchers to let them know a document has been requested. One of these remote researchers (the “Sourcerer”) claims the job, calls the document from the archives, takes a picture of it from within the Sourcery application, and sends it directly to the Sourcery requesting researcher. The requesting researcher pays a fee based on the scope of the request, the number of local Sourcerers available at the time, the urgency, and other variables. The Sourcerer receives the bulk of that fee for their efforts, and Sourcery receives a small percentage to maintain the service.'
                },
                {
                    question: 'Why Sourcery?',
                    answer: 'Though libraries and archives have built vast collections of digitized primary source materials over the last few decades, an even greater volume remains undigitized, available only through a trip to the archives or through in-house reproduction services. Currently, when a researcher needs a document that has not already been digitized and made accessible on the web, the available options are limited. Perhaps the most commonly chosen option is to plan a research trip to the remote archive to see the document in person, despite all the obvious disadvantages of time, planning, and expense. Another option is to contact the repository where the document is held to ask for the item to be digitized and sent directly. However, not all archives offer these services. Even when they do, it can often be difficult to find information about placing a request on an archive’s website. All archives differ in their processes, so it can take time to figure out the precise one for a given repository. Costs and delivery times vary widely. Some archives can provide access in a matter of hours or days for a nominal fee or at no cost. Others take weeks or months and charge as much as hundreds of dollars per document. At a minimum, the process of getting access to remote archival materials is a pain for researchers. In many cases the costs and hassle are prohibitive, and researchers choose simply to do without.',
                    answer2: 'Sourcery is designed expressly to remedy obstacles related to time, expense, and unclear processes for requesting and receiving documents. By precluding the need to pay for travel and lodging, Sourcery promises to dramatically reduce the cost of acquiring scans of documents. Similarly, Sourcery promises to significantly reduce the time it takes to acquire a document from months to mere hours in many cases. Sourcerers, who are paid a fee for each transaction, will have an incentive to rapidly return high quality images in order to continue attracting ressearchers. In these ways, the Sourcery app will connect individual researchers around the globe with on-site researchers at some of the world’s richest collections of primary source material at significantly reduced time, expense, and hassle. By providing one, simple platform that works across a range of institutions, Sourcery streamlines the document retrieval and reproduction process both for individual researchers and collecting institutions.',
                    answer3: 'The work here, however, is not just about saving researchers and collecting institutions time, money, and hassle. Ultimately, Sourcery’s work of connecting researchers to documents more effectively is about fulfilling the promise of citation. Citation is meant not only to provide evidence for the truth of claims made by authors, but to connect readers to resources that may be useful in enhancing their own knowledge and research. By connecting readers to the remote resources they find in notes and bibliographies, Sourcery will help fulfill the promise of the scholarly communication apparatus of citation built up by the academic community over centuries.'
                },
                {
                    question: 'Who is it for?',
                    answer: 'Humanities scholars are, of course, a natural audience for this service, but they are not the only ones who need remote access to the vast majority of archival documents that have not, and may never be, digitized. Other audiences include lawyers needing access to documents in court houses, amateur genealogists looking for parish records, scientists looking for historical data sets, and civil engineers looking for municipal planning documents. For these and other researchers, Sourcery will provide a streamlined and consistent experience for requesting documents from anywhere, thereby reducing time and hassle.',
                    answer2: 'While third-parties like graduate students are most likely to become Sourcerers, we expect that repositories themselves may ultimately constitute Sourcery’s main Sorcerer base. Professional librarians and archivists employed by institutions will often be best positioned to find and serve documents from their collections quickly and expertly. Indeed, institutional adoption of Sourcery should allow repositories themselves a chance to better serve their patrons, expand their geographical reach, and streamline their document scanning and provision workflows. Over time, as libraries and archives discover that Sourcery can help them identify new audiences for their collections, meet their remote patrons’ needs more effectively than their existing systems, and provide a new source of revenue, we expect that Sourcery will not only to become an end-user facing application but also a core piece of the library field’s technology infrastructure.'
                },
                {
                    question: 'Who are we?',

                    answer_link: 'Sourcery is a project of ',
                    answer_link01: 'Greenhouse Studios | Scholarly Communications Design at UConn. ',
                    answer_link02: 'A joint effort of the University of Connecticut’s School of Fine Arts (SFA), University Library, and College of Liberal Arts and Sciences (CLAS), Greenhouse Studios forges diverse and democratic collaborations that build humanities scholarship in new formats to engage new audiences. ',
                    answer_link03: 'Our projects',
                    answer_link04: ' include experiments with virtual and augmented reality, mobile applications development, alternative print formats, digital audio and video production, and games. While project work forms the bulk of our visible activity, the ultimate focus of Greenhouse Studios is building a new culture of collaboration. Reforming scholarly workflows for the digital age is less dependent on new products than on new attitudes toward working together. Greenhouse Studios’ primary “product” is thus a community of diverse collaborators comprised of faculty, librarians, editors, designers, developers, students, and others from across and outside the academy. Supported by substantial investments of staff and space from each of its constituent units and with major funding from the Andrew W. Mellon Foundation’s Scholarly Communications Program, Greenhouse Studios is forging a new model of inquiry-driven, collaboration-first scholarly production.',
                    answer2: 'The Sourcery leadership team consists of three experienced professionals drawn from the fields necessary to carry Sourcery to a successful outcome: digital humanities tool building; web and mobile application development; and digital archives. Project Director Tom Scheinfeldt is Associate Professor of Digital Humanities and Director of Greenhouse Studios. Scheinfeldt has played a leadership role in the development of several widely-used research and archives software packages, including, most notably, Omeka. Lead Developer Brian Daley is Assistant Professor in Residence in the Department of Digital Media and Design, where he brings nearly 20 years’ experience creating accessible web and mobile platforms for teaching and scholarship. Lead Archivist Greg Colati is Associate University Librarian for Archives, Special Collections, and Digital Curation and a recognized authority on digital archives tools and processes. In addition, Project Manager and Outreach Coordinator Wes Hamrick and Lead Designer Brooke Foti Gemmell bring broad experience in digital humanities research methods and project management and web and graphic design respectively.'
                },
                {
                    question: 'Where does Sourcery fit?',
                    answer: 'Sourcery exists at the confluence of three currently separate streams of computer software development: library and archives document retrieval services which Sourcery aims to improve; research software packages which Sourcery aims to complement; and “sharing economy” mobile applications which Sourcery aims to emulate.',
                    answer2: 'Sourcery aims to improve the existing systems and technologies whereby patrons access undigitized documents from remote collecting institutions, which currently employ a haphazard combination of methods for remote access. Many libraries and archives offer document reproduction and scan-on-demand services, often for a nominal fee, and a handful offer inter-library loan services for special collections materials. However, the process for requesting scans varies from institution to institution, and it is not always clear or obvious to the remote researcher how to find information about submitting requests or whom to contact.',
                    answer3: 'Along with the inconvenience of learning the request process for each individual archive, scholars also frequently contend with slow turnaround times. On-demand reproduction services are typically considered adjunct to the core functions of the archive and have limited resources. Sourcery lets individual researchers find and pay for someone nearby who has the resources—the time and wherewithal—to help them.',
                    answer4: 'Building image collections represents only one of many stages of the scholarly research process. Sourcery will align with scholars’ existing research workflows and encourage responsible scholarly practices. A 2012 Ithaka S+R report on the changing research practices of historians also advised that scholars need to “seamlessly integrate tools for organizing, annotating, and analyzing primary source materials into their workflows.” Scholars have increasingly adopted citation and document management systems to keep track of and enhance their personal research collections. Where possible, Sourcery will aim to complement and become interoperable with the constellation of common annotation, organization, and analysis tools and systems, such as Zotero, Mendeley, RefWorks, and Tropy. To this end, we have already had preliminary conversations with the project directors for Tropy and Zotero about interoperability with Sourcery and about the potential for developing an integration tool kit for these complementary applications. (The Corporation for Digital Scholarship, which supports Tropy, Omeka, and Zotero, will also support operations of Sourcery, thus laying the groundwork for this kind of close collaboration.)',
                    answer5: 'Mobile technology provides means of connecting people with local needs to people with local capacity. “Sharing economy” applications like Uber, AirBnB, and Instacart have demonstrated the promise of mobile technology to connect people who need a ride to people with local capacity (i.e. a car) or people who need groceries with people with local capacity (i.e. time to do the shopping). The connection in these applications is made based on geo-location data from mobile phones. The cost per transaction is determined according to an algorithm tuned to local conditions. In Uber’s case, for example, the pricing algorithm determines the rider’s cost based on variables such as the distance the rider needs to travel, the time of day, traffic conditions on the proposed route, and the proximity and number of available drivers. The growing popularity of these sharing economy applications demonstrates that individuals are sometimes better equipped or better incentivized than large organizations to meet the needs of other individuals. Recognizing the important questions these “gig economy” apps raise for issues of labor equity and responsible regulation, Sourcery nevertheless looks to apply the lessons (positive and negative) and technologies employed by these companies to address needs among library users and libraries themselves.'
                }
            ]
        }
    }
}
</script>

<style scoped>
.v-expansion-panel-header {
  padding: 16px
}
.v-expansion-panel {
  background: transparent !important
}
</style>
