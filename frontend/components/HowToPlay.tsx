import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function HowToPlay() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl md:text-3xl font-medium text-center mb-8">
        How to Play Super Bowl Squares & Sports Pools
      </h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Sports Squares Rules for NFL, NBA, and More
          </CardTitle>
          <CardDescription>
            Learn how to play Super Bowl squares, NFL football pools, NBA
            basketball squares, and other sports betting games
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6 pt-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Understanding the Squares Grid
            </h3>
            <p>
              Whether you&apos;re playing Super Bowl squares, NFL playoff pools,
              or NBA basketball squares, the game uses a 10x10 grid creating 100
              squares. The columns (0-9) represent one team&apos;s score (like
              the Chiefs or 49ers in the Super Bowl), while the rows (0-9)
              represent the other team&apos;s score. This format works for any
              professional sports game including NFL football, NBA basketball,
              and other major sporting events.
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              How to Pick Your Squares
            </h3>
            <p>
              In Super Bowl squares and other sports betting pools, participants
              select one or multiple squares on the grid. Each square represents
              a possible score combination using the last digit of each
              team&apos;s score.
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Random Number Assignment
            </h3>
            <p>
              For Super Bowl squares and other sports pools, once all squares
              are filled, numbers 0-9 are randomly assigned to both the rows and
              columns. This random assignment ensures fair play whether
              you&apos;re betting on NFL football games, NBA basketball matches,
              or other sporting events. Popular during the Super Bowl, this
              system gives everyone an equal chance at winning.
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              How to Win at Sports Squares
            </h3>
            <p>
              In NFL football squares, including Super Bowl pools, winners are
              typically determined at the end of each quarter. For NBA
              basketball squares, winners are usually checked at quarter ends.
              The winning square matches the last digit of each team&apos;s
              score at these checkpoints. For example, if the Super Bowl score
              is Chiefs 27, 49ers 23, the winning square would be where 7 and 3
              intersect.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
