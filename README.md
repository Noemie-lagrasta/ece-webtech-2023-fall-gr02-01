
# Blogging application - ECE Webtech project

This project is a web application that lists posts by travelers about destinations they have visited.
We run the application by using "npm run build"

## Deliverables 

- Vercel URL: https://ece-webtech-2023-fall-gr02-01.vercel.app/
- Supabase project URL: https://ugxpwajfppcpboosjczr.supabase.co

## Authors

- Ariane AUBRUN, group 02
- Noemie LAGRASTA, group 02

## Evaluation

### Mandatory Tasks

* **Naming convention**
  * Grade: 2
  * Comments: We look at the community conventions 
  * Task feedback: this task was systemeic.
* **Project structure**
  * Grade: 2
  * Comments: we used basical names to be clear on each implementation goals. 
* **Git usage**
  * Grade:2
  * Comments: We took a look at the universal commits guide to be able to name commits correctly according to what they were: fixing a problem, adding a feature, ...
  * Task feedback: this task was systemeic once we get the logic.
* **Code quality**
  * Grade: 3
  * Comments: we format the document each time we update it but for the comment it was difficult because we didn't have too much time
* **Design, UX, and content**
  * Grade: 4
  * Comments: tailwind was really usefull, it allowed us to make a beautiful site in different modes

* **Home page**
  * Grade: 2
  * Comments: we look at other websites on the web to take inspiration
* **Navigation**
  * Grade: 2
  * Comments: We have a navigation bar where the user can find: Posts (to see all the posts available in our database), Maps (the user can navigate on the map to see where there are posts availables), About us (small introduction of us the authors), Contact us ( a page with a formular to contact us), User.email (to access its personal dashboard), the sign in/ sign out button, the dark/light mode button
  * Task feedback: the method is the same for each layers so, once we get it it was very simple
* **Login and profile page**
  * Grade:4
  * Comments: we retrieve the user's email address once logged in to put it in the header, then in the login page there is the possibility to log in or sign up with credentials or by the provider github. We usedthe supabase authentification service
  * Task feedback: This was the primary step in supabase
* **Post creation and display**
  * Grade: 5
  * Comments: In the page '/posts' we can find all the posts persist in the database, then you can add an article by fill a form and refind it on the page. The frm is available in your personal Dashboard: "write a new post", because only authentificated can add a post.
by clicking on each chevron, we can access to a personnal dipslay of each post.
* **Comment creation and display**
  * Grade: 4
  * Comments: On each creation, we can comment and the comment is immediatly fetch and display.
  We can also add a mark by using the stars ratings (this is one of our bonus task).
* **Post modification and removal**
  * Grade: 4
  * Comments: We used the heroicons librabry to display "edit" and "delete" button only visible by the author of each post.
The edit button open a page dedicated to update it own post.
The delete button open a modal to confirme the act of deletion.
  * Task feedback: by doing this task we see that there is a lot of icons in heroicons, we discorverd them and used them on other parts of the project. 
* **Search**
  * Grade: 4
  * Comments: We allow user to search a ciy, a user (a user who posts on our site to see only his articles), a way of transport. the search bar is available on the '/posts' page.
* **Use an external API**
  * Grade: 2
  * Comments: We use twice:
  - when a user add a new post: when he puts the destination city name, we ask him to precise the contry by using the select input : we recuperate all the countries name from 'http://api.geonames.org/countryInfoJSON'
  - Then on the maps tab in the header: there is a mab recuperate by leaflet, and then when the user click on the map, we get the longitude and latitude values, we sen them to geonames to recuperate each names country and fetch all the posts corresponding to this country.
  * Task feedback: This task was new and really interesting.
* **Resource access control**
  * Grade: 5
  * Comments: We have 4 tables in the project:
  - ratings: only authentificated user are allowed to leave a rate and a comment.
  - contacts:  authentificated user and user with an email finishing by '@webtrips'  are allowed to insert in, and only user with an email finishing by '@webtrips'  are allowed to select in.
  - users; only for authentificated users.
  - travels only authentificatded can insert, delete and update but all can select. 
 * **Account settings**
  * Grade: 4
  * Comments: In the personal dashboard: the user can see it personal information and update them ( we implemented them such a bonus task)
* **WYSIWYG integration**
  * Grade: 2
  * Comments: on all our form when the user must provide a text : we used the WYSIWYG library in particular the react-quill.
* **Gravatar integration**
  * Grade: 2
  * Comments: Each time a user logs in, the gravatar associated with their email is retrieved in the UserContext by const gravatarUrl = 'https://www.gravatar.com/avatar/${MD5(email.toLowerCase())}?s=150&d=identicon';
* **Light/dark mode**
  * Grade: 2
  * Comments: We implement a switch between dark and light themes. We put a boolean variable to let persist the setting for the user session; and each time the user reconnects, we request the value of the boolean in the database.

### Bonus Tasks

* ***Stars ratings**
  * Grade: 2
  * Comments: We used a system of notation from 0 to Five by hand-over the stars displayed, the grade is stored in the database and we display on each dedicated page the average rating of each post.
* ***Update account information**
  * Grade: 3
  * Comments:  the user can update his password by using the function provide by supabase. The user can also update it's account by adding informations such as : nickanme, a phone number, a personal address. All of this is implemented.
* ***Admin dashboard**
  * Grade: 3
  * Comments: on this dashworad, only available for those with an email finishing by '@webtrips.com', on this dashboard the admin can manage all the posts (possibility to delete them) and then he has an access to alle the contact message received and can answer to them, the answer is saved in the database.
  * If you want to try: we created an administrator account {email: noemie@webtrips.fr, password: adminwebtrips}.
* ***Add nested comments**
  * Grade: 2
  * Comments:on each post, author can see the reviews and reply to them, it is display in nested way because we create in the databse the attribute 'parentID': if it's a reply we had the postID to which it responds, else it is a null values.

### Course Feedback

The great thing about this course is that it's a constant improvement on the previous lab. Over the course of the labs, we could really see our web application improving and taking shape like the ones we were working on.
We found that the teachers knew how to answer all our questions, whether it was the lectures or the physical classes: they were all comprehensive.
One of the real pluses was the use of github and its organization.
Indeed, course content could be found in the indexes of each module.

### Project Reuse

- [x] We authorize the professors to use our project as an example for the next year students (facultative).
