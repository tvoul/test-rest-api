# General overview

"Diagon Alley" is a webbshop for all your magical needs. The team behind it are:

- Dennis (AnderssonDennis)
- Maria (MariaFranz)
- Mia (Entitet)
- Tomas (tvoul)

We communicate on Discord and keep track of the project via a Trello-board. As a new teammember you get access to these - if you haven't already gotten access ask Tomas (Discord) and Mia (Trello).

# Getting started
After you clone the code from Github and open it with Visual Studio Code for the first time you need to run **npm install** in the terminal.

The next step, which applies for a new clone of the project or when you have created a new branch, is to open the database folder and delete the **shop.db** file. Then copy the **template.db** file and rename this copy shop.db. Place your new shop.db file back into the database folder. When you are ready you need to have both files (shop.db and template.db) in the database folder. We do this because the shop.db file changes (as sessions are logged) when you run the project and these changes might cause unnecessary merge conflicts if we track it in version control.

Now you are ready to run the project. You do this by typing **npm start** in the terminal. But before you start actively working with the project, please read further about how we work in branches.

# Branching-setup

We are working in branches: 

The **main branch** is for code that is ready to go live. The current main branch is also the same as our product that is in use.

The **dev branch** is our default branch. This is where the version of the product that is under development is.

**Hotfix branches** are used when something goes wrong and needs to be fixed as soon as possible.

**Feature branches** are where you do most of your daily work. You create a feature branch for your work and when you are ready you merge it, following the merging strategy described below.

The branches dev and main are protected. To be able to merge your changes into them you need to do a pullrequest. The automated tests run and should pass. There are also codeowners that do a manual coderewiev.

## Merge conflicts

If you encounter a merging conflict where another teammembers code clashes with your own and you need to discuss how to proceed (compromise or decide whose code takes precedence) the team communicates primarily via Discord.

## Creating and merging branches

As stated above the main branch is our working product that is live and the dev branch is the current new version of the product we are working on. We treat these branches with care and don't code in them. Our work will therefore happen in feature branches for planned work and hotfix branches for unplanned/urgent work.

**Feature-branch**

A feature branch may branch off from:

- *dev*

Must merge back into:

- *dev*

Should be named:

 - feature-descriptive-name-of-feature, eg. feature-shoppingcart.

A feature might be incorporated into the product, or it might be discarded. As we are working with the DevOps mindset of continual learning and experimentation a discarded feature should also be seen as a valuable contribution.

*Merging*: 

First you merge dev into your feature branch. Then you may merge your feature branch into dev.

When your feature is no longer in active development the branch is deleted.

**Hotfix-branch**

A hotfix branch may branch off from:

- *main*

Must merge back into:

- *main* and *dev*

Should be named:

- hotfix-descriptive-name-of-hotfix, eg. hotfix-calculating-total-price.

The reason we branch off from main is that a hotfix intends to adress a critical issue in the live production release and therefore needs to be adressed as soon as possible. The hotfix is merged back into main to resolve the issue and into dev so that the hotfix isn't rolled back accidentally when a new release is ready.

*Merging*

Merging into main: first you merge main into your hotfix branch. Then you merge your hotfix branch into main.

Merging into dev: first you merge dev into your hotfix branch. The you merge your hotfix branch into dev. (If there are merge conflicts it's especially important you discuss with team members involved so they are aware of the critical issue and the fix.)

When the hotfix is no longer in active development the branch is deleted.

**Main**

When we are ready to go live with a new version of the project the dev branch will be merged into the main branch. 

First you merge main into dev. Then you may merge dev into main and trigger the process for a new version of the product to go live.

This process is described in more detail below under **CD**.


# Tests and CI

We perform three different kinds of tests:

- We test our API with Postman/Newman
- We test our GUI with WebdriverIO
- We perform unit tests with Jest.

To run the unit tests write **npm test** in the terminal. The project doesn't need to be up and running for you to able to perform these tests.

To run the API and GUI tests locally you need to have the project up and running (**npm start**). After this open a new terminal window to run the commands for testing. 

GUI-tests run with the command: **npm run wdio**. For the API-tests to run you need to install Newman (**npm install newman**) if you have not done so already. The tests are then run by the following commands: 
- **newman run test-rest-api/test-visitor.postman_collection.json**
- **newman run test-rest-api/test-customer.postman_collection.json** 
- **newman run test-rest-api/test-admin.postman_collection.json**.

These tests are gathered and automated to run in the following workflow: tests.yml.

The automated tests need to pass for a merge into our protected branches main and dev to be approved. 

# CD

When deploying to dev or to main all the automated tests need to pass for a deployment job to run.

Our dev server is: (not here yet as it might not be something we want to put openly on Github)

Our main (live) server is: (not here yet as it might not be something we want to put openly on Github)

The replacing of shop.db with a copy of template.db is handled in the workflow when we deploy to both dev and main. But to avoid problems with info missing from the database if we have visitors/users in the webbshop when deploying a new live version we need to take the site down for maintenance before deployment.

#DevOps

We strive to work according to the three ways of DevOps (Kim et al.): The Principles of Flow, The Principles of Feedback, The Principles of Continual Learning and Experimentation. 

For the first way we make our work visible and limit work in progress by using and following up our Trello board. We have a CI/CD setup to enable a stable flow of work from development to operations to live product. 

For the second way we have set up (and automated) tests to give fast indications if there are problems in the code. We also try to work responsibly following the branching strategy, and have routines for communication if there arises merging conflicts. Working according to scrum opens up for feedback both in the team and towards stakeholders.

As the project itself is part of a learning environment continual learning and experimentation is a way of working. We try to support eachother in the team and have a high-trust culture where both success and failure are seen as ways to learn and move forward.