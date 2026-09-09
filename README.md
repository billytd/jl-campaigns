This is a [Next.js](https://nextjs.org) demo project by Billy Flaherty that allows users to login, view, create and update ad campaigns. It focuses on leveraging Next.js's app router functionality as an exercise to deomonstrate it's ability and the author's grasp of it's capabilities.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The data store is just a few json files, to act as a crude proof-of-concept, which are included in this repo for convenience.

Login with one of the following users:

### Test Users

- Lashay McLaughlan
  - email: l.mclaughlan@example.com
  - pass: testingLM123
  - role: normal
- Edmundo Power
  - email: e.power@example.com
  - pass: testingEP123
  - role: normal
- Kristin Quinlan
  - email: k.quinlan@example.com
  - pass: testingKQ123
  - role: admin

## Development Decisions

- I used app router for many of the built in conveniences, such as:
  - the built-in api routing
  - server-side by default, keeps js footprint in browser smaller, easy to implement and protect data
  - convenient layout functionality makes applying a layout to multiple pages easy (could have nested re-usable layouts, but didn't really need that for this)
  - private components helps keep specially purposed components from "accidentally" being used in inappropriate places
  - "use cache" makes caching simple. Quite slick.
- I initially tried using crudcrud.com for data, but they were having intermittent unavailability (500 status errors), so I re-implemented the data-store using locally stored json files (committed in repo). Obviously not something for production.

## Would Implement For "Real" Production Application:

- full authentication and session management
  - more robust/centralized authorization handling
- pagination of campaigns on the dashboard
- filtering and search of campaigns
- probably wouldn't use a cookie to store the user token
- unit tests
- made more use of private components
- would have spent more time organizing / breaking up server.ts
- would like a nicer UI lib
  - Mantine looks like fun to explore
- a database
