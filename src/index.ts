import { Probot, run } from "probot";

run((app: Probot) => {
  app.on("issue_comment.created", async (context) => {
    if (context.payload.comment.user.type === "Bot") return;

    if (typeof context.payload.issue.pull_request === "undefined") return;

    const comment = context.payload.issue.body;

    if (!comment) return;

    const commandMatcher = /^\/([\w]+).*/m;

    if (commandMatcher.test(comment)) {
      const [match, commandName] = comment.match(commandMatcher)!;
      context.octokit;
      if (commandName === "patcher") {
        const pullRequestUrl = context.payload.issue.pull_request.url;
        if (typeof pullRequestUrl === 'undefined') return;
        const pullRequestRepo = context.repo({
          ref: pullRequestUrl
        });
        context.octokit.rest.repos.downloadTarballArchive({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          ref: context.payload.issue.pull_request.url!
        });
      }
    }
  });
});
