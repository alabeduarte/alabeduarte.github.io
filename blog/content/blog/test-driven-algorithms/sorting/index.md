---
title: Test-Driven Algorithms - Sorting
date: "2021-06-10T06:58:04.414Z"
description: "In this article, I’d like to explore a couple of implementations
of sorting algorithms. However, I’d like to do so driven by unit tests.
The examples are written in Go but don't worry if you never worked with Go
before. The emphasis here is on the journey and the joy of building solutions
guided by tests!"
---

Sorting algorithms are heavily used in Software Development in one way or
another. Depending on the language, you might have in handy some sorting
functions at your disposal but depending on the use case, knowing which sorting
algorithm is being applied under the hood can be key to measure the impacts of
the change on the working Software.

In this article, I'd like to explore a couple of implementations of sorting
algorithms but I'd like to do so driven by unit tests. I haven't seen much
content online that explore this approach so I hope this sparks your interest.

## A recap on what Sorting Algorithms are

Most of the sorting algorithms definitions I'll be using were extracted from the
[Wikipedia](https://en.wikipedia.org/wiki/Sorting_algorithm) so here's a summary
to kick us off:

> A sorting algorithm is an algorithm that puts elements of a list in a certain
> order.

_borrowed from Wikipedia_

<iframe src="https://giphy.com/embed/ezjd4NlY4w3io" width="480" height="376" frameBorder="0" class="giphy-embed" allowFullScreen />
<p><a href="https://giphy.com/gifs/algorithm-ezjd4NlY4w3io">via GIPHY</a></p>

## How we will approach this

The idea here is to implement one or two sorting algorithms but doing so driven
by tests. Basically, we'll write a single test first, with a simple scenario
with input and expected output. This will fail because there won't be any
code just yet. Then we will write the minimum necessary code to satisfy the
test and repeat the process. The name of this technique is Test-Driven
Development (TDD). If you're curious about this process or if it doesn't sound
familiar to you, please visit [this post](/tdd).

The language I'll use will be [Go](https://golang.org/) and using a single file
with **both test and implementation** for simplicity.

If you are not familiar with the Go language, don't worry. I will post different
snippets of code to illustrate every step as we were scrolling up and down in a
file. The idea here is to explore the technique, not the syntax or peculiarities
of Go.

You might notice that I'll be using the term
[Array](https://en.wikipedia.org/wiki/Array_data_structure) although in Go there
is a difference between [Arrays and
Slices](https://blog.golang.org/slices-intro) and, technically, I'll be using
Slices during the code.

I'll also try to describe each step, so pretend we're doing some [Pair
Programming](https://martinfowler.com/articles/on-pair-programming.html)

## Let's kick it off

All right. As I mentioned below, I'd like to start with a simple test that would
force me to add the least amount of code just to get things working, then we can
add more to it. In terms of which algorithm I intend to chose, I'll go with
[Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort). Then we evaluate if
this is good enough for us, if not, we refactor our code to choose a different
implementation. The important thing here is: at the end, regardless of the
algorithm we choose, the tests need to pass as we'll still want to sort our
elements.

_Also, for simplicity, our sorting algorithm will only be going to handle numbers
(integers to be more precise)._

Let's start with the simplest input possible, which would be an empty array. Why?
Because if we want to sort an empty array, the result should be an empty array!
The approach I'd like to follow is to get things going with **minimal moves as
possible** because we need constant feedback. We could start with an array with
4 elements and write a test which would expect this array to be sorted, but this
would require us spending more time writing code, less time writing test. I'd
like to get some balance and make sure we don't leave any edge case behind.

```go
package sorting_test

import (
	"testing"

	"github.com/matryer/is"
)

func TestSort(t *testing.T) {
	t.Run("should return same value when array is empty", func(t *testing.T) {
		is := is.New(t)
		elements := [0]int{}
		expected := [0]int{}

		is.Equal(Sort(elements), expected)
	})
}
```

Running the test above with `go test`, it will fail:

```
go test ./.
2021/06/08 14:06:17 exit status 2
# alabeduarte.com_test [alabeduarte.com.test]
./sorting_test.go:15:12: undefined: Sort
FAIL    alabeduarte.com [build failed]
FAIL
FAIL (0.22 seconds)
```

This is because `Sort` method is not defined anywhere. Let's make the
minimal effort to get this passing than by defining the method and make it
return an empty array so our test will pass!

```go
// Implementation file

func Sort(_elements []int) []int {

	return []int{}
}
```

_Note that we're always returning an empty array, no matter what_

Running the tests:

```
go test ./.
ok      alabeduarte.com 0.940s
PASS (0.39 seconds)
```

Now let's add another test scenario where it will force us to write something
other than hardcoded response:

```go
// Test file

func TestSort(t *testing.T) {

  // previous test scenario is omitted here ...

  t.Run("should return same value when array has only one element", func(t *testing.T) {
    is := is.New(t)
    elements := []int{1}
    expected := []int{1}

    is.Equal(Sort(elements), expected)
  })
}
```

```
go test ./.
2021/06/08 14:04:49 exit status 1
        sorting_test.go:29: [] != [1]
--- FAIL: TestSort (0.00s)
    --- FAIL: TestSort/should_return_same_value_when_array_has_only_one_element (0.00s)
FAIL
FAIL    alabeduarte.com 0.101s
FAIL
FAIL (0.31 seconds)
```

This is expected since our implementation code is always returning an empty
array. Let's change that and make the test pass, but in a way that would require
the minimal effort possible to achieve that:

```go
// Implementation file

func Sort(elements []int) []int {

	return elements
}
```

_Note that returning the elements themselves satisfies both scenarios we have so far_

```
go test ./.
ok      alabeduarte.com 0.766s
PASS (0.39 seconds)
```

Now that our two scenarios are passing, let's evaluate our code so far...

Ok, looking at the code, there's no much I can think of to improve, except for
the fact that our tests are a bit verbose at the moment. We're defining
variables `elements` and `expected` in our tests, then we're doing the following
evaluation:

```go
is.Equal(Sort(elements), expected)
```

Considering how simple our test is at the moment, I feel we could do things
inline, so let's refactor it:

```go
// Test file

func TestSort(t *testing.T) {
	t.Run("should return same value when array is empty", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{}), []int{})
	})

	t.Run("should return same value when array has only one element", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{1}), []int{1})
	})
}
```

Now, running the tests, they still should be passing, since we didn't add
anything new:

```
go test ./.
ok      alabeduarte.com (cached)
PASS (0.24 seconds)
```

Good. Now everything is "green" (a.k.a passing), let's add a new scenario that
would actually require us to apply any sort of algorithm. However, let's add
something really simple, like 2 numbers:

```go
// Test file

func TestSort(t *testing.T) {
  // ...

	t.Run("should return the lowest element followed by the largest element", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{2, 1}), []int{1, 2})
	})
}
```

As expected, the test should fail:

```
go test ./.
2021/06/08 14:21:11 exit status 1
        sorting_test.go:31: [2 1] != [1 2]
--- FAIL: TestSort (0.00s)
    --- FAIL: TestSort/should_return_the_lowest_element_followed_by_the_largest_element (0.00s)
FAIL
FAIL    alabeduarte.com 0.098s
FAIL
FAIL (0.34 seconds)
```

Now, let's make it pass!

```go
// Implementation file

func Sort(elements []int) []int {

	if len(elements) <= 1 {
		return elements
	}

	return []int{elements[1], elements[0]}
}
```

```
go test ./.
ok      alabeduarte.com 0.759s
PASS (0.37 seconds)
```

That's great! The tests are all passing. You might be wondering... our
implementation doesn't sound very reliable isn't it? A few things can go wrong
there... also, it feels like we're cheating because we're always grabbing the
first and second element and returning them into the reverse order, there's no
sorting going on, to be honest. Let's break the code down and discuss it further
what we can do next:

```go
// Implementation file

func Sort(elements []int) []int {

  // here we are checking if the length is less or equal to 1
  // which means that if the array is empty we will return the elements
  // themselves (an empty array) and if the array has only one element, it will
  // also return itself.
	if len(elements) <= 1 {
		return elements
	}

  // On this case, we're grabbing the second elemnt and the first element and
  // swapping the order of the two
	return []int{elements[1], elements[0]}
}
```

Basically, if the array has more than 2 elements, our code will only return the
first two with reverse order. So here are a few things that can go wrong with
this algorithm:

* When the elements' length is greater than 2, our sorting algorithm will ignore
  the rest, returning an array with fewer elements
* When the elements are already sorted, our sorting algorithm will mess it up by
  swapping the first two elements

Should we fix them? **Yes, but we should do so only we have tests.**

It is pretty clear that our code is doing the wrong thing. But as tempting as it
might sound, let's only add a new code into our implementation if we have a test
scenario that would **justify** its existence!

So let's start with the following test scenario:

```go
// Test file

func TestSort(t *testing.T) {
  // ...

	t.Run("should return an array with the same length as the one provided as an input", func(t *testing.T) {
		is := is.New(t)

		sortedElements := Sort([]int{2, 1, 4, 3})
		actualLength := len(sortedElements)

		is.Equal(actualLength, 4)
	})
}
```

As expected, the tests will fail:

```
go test ./.
2021/06/08 14:40:57 exit status 1
        sorting_test.go:44: 2 != 4
--- FAIL: TestSort (0.00s)
    --- FAIL: TestSort/should_return_an_array_with_the_same_length_as_the_one_provided_as_an_input (0.00s)
FAIL
FAIL    alabeduarte.com 0.101s
FAIL
FAIL (0.34 seconds)
```

Now let's make it pass:

```go
// Implementation file

func Sort(elements []int) []int {

	if len(elements) <= 1 {
		return elements
	}

  // take the elements from index 2 onward
	rest := elements[2:]

  // append the rest to the original array we had
	return append([]int{elements[1], elements[0]}, rest...)
}
```

The tests are passing:

```
go test ./.
ok      alabeduarte.com 0.801s
PASS (0.47 seconds)
```

Since we are making sure the array length will always be the same but we're
still compliant with the other test scenarios. However, the implementation now
is a bit clunky and this is a sign that it is time to actually implement the
algorithm!

Let's add a scenario that is simple enough to illustrate that we can sort more
than 2 elements without having a clunky implementation. So let's use 3 elements
this time:

```go
// Test file

func TestSort(t *testing.T) {
  // ...

	t.Run("should sort all the elements from the lowest to the largest", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{2, 3, 1}), []int{1, 2, 3})
	})
}
```

And it should fail, of course:

```
go test ./.
2021/06/08 14:56:24 exit status 1
        sorting_test.go:51: [3 2 1] != [1 2 3]
--- FAIL: TestSort (0.00s)
    --- FAIL: TestSort/should_sort_all_the_elements_from_the_lowest_to_the_largest (0.00s)
FAIL
FAIL    alabeduarte.com 0.099s
FAIL
FAIL (0.40 seconds)
```

Now let's implement some sorting algorithm here. For now, let's use the
the algorithm called [Bubble Sort](https://en.wikipedia.org/wiki/Bubble_sort).

As stated on Wikipedia, bubble sort is one of the simplest sorting algorithms to
understand and implement, but its efficiency decreases dramatically on larger
lists. More details [here](https://en.wikipedia.org/wiki/Bubble_sort#Use).

_If you want to know more about the implementation of this algorithm in Go, I
also suggest this material:
https://tutorialedge.net/courses/go-algorithms-course/21-bubble-sort-in-go/_

```go
// Implementation file

func Sort(elements []int) []int {

	n := len(elements)
	if n <= 1 {
		return elements
	}

	swapped := true

	for swapped {
		swapped = false

		for i := 0; i < n-1; i++ {
			if elements[i] > elements[i+1] {
				elements[i], elements[i+1] = elements[i+1], elements[i]
				swapped = true
			}
		}
	}

	return elements
}
```

With the implementation above, all the tests should pass:

```
go test ./.
ok      alabeduarte.com 0.858s
PASS (0.51 seconds)
```

## Efficiency

Our algorithm (bubble sort) is not the most efficient out there. The complexity
of the algorithm is _O(n²)_, where _n_ is the number of elements being sorted.
This means that its efficiency decreases as the number of elements grow. There
are other options we can use here such as [insertion
sort](https://en.wikipedia.org/wiki/Insertion_sort) or [selection
sort](https://en.wikipedia.org/wiki/Selection_sort) that are considered my
efficient.


Without necessarily changing anything, let's do a benchmark with our current
algorithm using [Go testing benchmarks](https://golang.org/pkg/testing/#hdr-Benchmarks).

First, let's create a small function (within our test file) to generate random
elements with a given length:

```go
// Test file

func generateRandomElements(n int) []int {

	// initialise a slice with length and capacity of "n"
	elements := make([]int, n, n)

	// populate the slice with random elements
	for _ = range elements {
		elements = append(elements, rand.Int())
	}

	return elements
}
```

Now let's create a function that will iterate over our method Sort taking the
`testing.B` as a parameter:

```go
// Test file

func benchmarkBubbleSort(n int, b *testing.B) {

for i := 0; i < b.N; i++ {
  elements := generateRandomElements(n)

  // sort elements
  Sort(elements)
}
```

Finally, let's create some benchmark functions to test the efficiency of our
code:

```go
// Test file

func BenchmarkBubbleSort3(b *testing.B)      { benchmarkBubbleSort(3, b) }
func BenchmarkBubbleSort10(b *testing.B)     { benchmarkBubbleSort(10, b) }
func BenchmarkBubbleSort20(b *testing.B)     { benchmarkBubbleSort(20, b) }
func BenchmarkBubbleSort50(b *testing.B)     { benchmarkBubbleSort(50, b) }
func BenchmarkBubbleSort100(b *testing.B)    { benchmarkBubbleSort(100, b) }
func BenchmarkBubbleSort1000(b *testing.B)   { benchmarkBubbleSort(1_000, b) }
func BenchmarkBubbleSort100000(b *testing.B) { benchmarkBubbleSort(100_000, b) }
```

When running the following command:

```
$ go test -bench=.
```

Here's the result:

```
go test -bench=.
goos: darwin
goarch: amd64
pkg: alabeduarte.com
cpu: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
BenchmarkBubbleSort3-12                 11577649               101.7 ns/op
BenchmarkBubbleSort10-12                 2687889               427.9 ns/op
BenchmarkBubbleSort20-12                  894934              1340 ns/op
BenchmarkBubbleSort50-12                  205489              6001 ns/op
BenchmarkBubbleSort100-12                  60349             18323 ns/op
BenchmarkBubbleSort1000-12                   966           1260727 ns/op
BenchmarkBubbleSort100000-12                   1        20640230871 ns/op
```

As you can see, when having 100,000 elements in the array, my machine took
`20640230871` nanoseconds to perform the sorting, which was equivalent to about
20 seconds.

Let's try the same using the [Go's standard
library](https://golang.org/pkg/sort/) implementation to sort our elements.
Let's create a small function that will generate random elements and call the
method [Ints](https://golang.org/pkg/sort/#Ints) from the package
[sort](https://golang.org/pkg/sort):

```go
func benchmarkGoSort(n int, b *testing.B) {

	for i := 0; i < b.N; i++ {
		elements := generateRandomElements(n)

		// sort elements
		sort.Ints(elements)
	}
}
```

Now let's create similar benchmark functions that will compare our `Sort`
functin against [sort.Ints](https://golang.org/pkg/sort/#Ints) function:

```go
func BenchmarkGoSort3(b *testing.B)      { benchmarkGoSort(3, b) }
func BenchmarkGoSort10(b *testing.B)     { benchmarkGoSort(10, b) }
func BenchmarkGoSort20(b *testing.B)     { benchmarkGoSort(20, b) }
func BenchmarkGoSort50(b *testing.B)     { benchmarkGoSort(50, b) }
func BenchmarkGoSort100(b *testing.B)    { benchmarkGoSort(100, b) }
func BenchmarkGoSort1000(b *testing.B)   { benchmarkGoSort(1_000, b) }
func BenchmarkGoSort100000(b *testing.B) { benchmarkGoSort(100_000, b) }
```

Now let's run the benchmark:

```
go test -bench=.
goos: darwin
goarch: amd64
pkg: alabeduarte.com
cpu: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
BenchmarkBubbleSort3-12                 11743804               102.6 ns/op
BenchmarkBubbleSort10-12                 2891732               441.7 ns/op
BenchmarkBubbleSort20-12                  935710              1309 ns/op
BenchmarkBubbleSort50-12                  204036              5818 ns/op
BenchmarkBubbleSort100-12                  62976             19958 ns/op
BenchmarkBubbleSort1000-12                   925           1316431 ns/op
BenchmarkBubbleSort100000-12                   1        19976397622 ns/op

BenchmarkGoSort3-12                      7070913               172.9 ns/op
BenchmarkGoSort10-12                     1706870               692.7 ns/op
BenchmarkGoSort20-12                      783583              1652 ns/op
BenchmarkGoSort50-12                      276848              4444 ns/op
BenchmarkGoSort100-12                     124602              9288 ns/op
BenchmarkGoSort1000-12                     10000            118388 ns/op
BenchmarkGoSort100000-12                      63          18260485 ns/op
```

As we can see, our algorithm using bubble sort seems a little better until 50
elements, where go standard library start to shine being way faster than ours.

Since the go standard library is more efficient, let's change our implementation
to use that instead and re-run the tests:

```go
// Implementation file

func Sort(elements []int) []int {

	sort.Ints(elements)

	return elements
}
```

All tests should still be passing:

```
go test -v
=== RUN   TestSort
=== RUN   TestSort/should_return_same_value_when_array_is_empty
=== RUN   TestSort/should_return_same_value_when_array_has_only_one_element
=== RUN   TestSort/should_return_the_lowest_element_followed_by_the_largest_element
=== RUN   TestSort/should_return_an_array_with_the_same_length_as_the_one_provided_as_an_input
=== RUN   TestSort/should_sort_all_the_elements_from_the_lowest_to_the_largest
--- PASS: TestSort (0.00s)
    --- PASS: TestSort/should_return_same_value_when_array_is_empty (0.00s)
    --- PASS: TestSort/should_return_same_value_when_array_has_only_one_element (0.00s)
    --- PASS: TestSort/should_return_the_lowest_element_followed_by_the_largest_element (0.00s)
    --- PASS: TestSort/should_return_an_array_with_the_same_length_as_the_one_provided_as_an_input (0.00s)
    --- PASS: TestSort/should_sort_all_the_elements_from_the_lowest_to_the_largest (0.00s)
PASS
ok      alabeduarte.com 0.920s
```

If you are interested to see the entire code we've built, please uncollapse the
section below:

<details>
<summary>(click to expand)</summary>
<p>

```go
package sorting_test

import (
	"math/rand"
	"sort"
	"testing"

	"github.com/matryer/is"
)

// Implementation:
//
// Sort will receive a slice as an input and it will return another slice but
// sorted.
func Sort(elements []int) []int {

	sort.Ints(elements)

	return elements
}

// Unit tests:
func TestSort(t *testing.T) {

	t.Run("should return same value when array is empty", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{}), []int{})
	})

	t.Run("should return same value when array has only one element", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{1}), []int{1})
	})

	t.Run("should return the lowest element followed by the largest element", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{2, 1}), []int{1, 2})
	})

	t.Run("should return an array with the same length as the one provided as an input", func(t *testing.T) {
		is := is.New(t)

		sortedElements := Sort([]int{2, 1, 4, 3})
		actualLength := len(sortedElements)

		is.Equal(actualLength, 4)
	})

	t.Run("should sort all the elements from the lowest to the largest", func(t *testing.T) {
		is := is.New(t)

		is.Equal(Sort([]int{2, 3, 1}), []int{1, 2, 3})
	})
}

// Benchmarks:

func generateRandomElements(n int) []int {

	// initialise a slice with length and capacity of "n"
	elements := make([]int, n, n)

	// populate the slice with random elements
	for _ = range elements {
		elements = append(elements, rand.Int())
	}

	return elements
}

func benchmarkBubbleSort(n int, b *testing.B) {

	for i := 0; i < b.N; i++ {
		elements := generateRandomElements(n)

		// sort elements
		Sort(elements)
	}
}

func benchmarkGoSort(n int, b *testing.B) {

	for i := 0; i < b.N; i++ {
		elements := generateRandomElements(n)

		// sort elements
		sort.Ints(elements)
	}
}

func BenchmarkBubbleSort3(b *testing.B)      { benchmarkBubbleSort(3, b) }
func BenchmarkBubbleSort10(b *testing.B)     { benchmarkBubbleSort(10, b) }
func BenchmarkBubbleSort20(b *testing.B)     { benchmarkBubbleSort(20, b) }
func BenchmarkBubbleSort50(b *testing.B)     { benchmarkBubbleSort(50, b) }
func BenchmarkBubbleSort100(b *testing.B)    { benchmarkBubbleSort(100, b) }
func BenchmarkBubbleSort1000(b *testing.B)   { benchmarkBubbleSort(1_000, b) }
func BenchmarkBubbleSort100000(b *testing.B) { benchmarkBubbleSort(100_000, b) }

func BenchmarkGoSort3(b *testing.B)      { benchmarkGoSort(3, b) }
func BenchmarkGoSort10(b *testing.B)     { benchmarkGoSort(10, b) }
func BenchmarkGoSort20(b *testing.B)     { benchmarkGoSort(20, b) }
func BenchmarkGoSort50(b *testing.B)     { benchmarkGoSort(50, b) }
func BenchmarkGoSort100(b *testing.B)    { benchmarkGoSort(100, b) }
func BenchmarkGoSort1000(b *testing.B)   { benchmarkGoSort(1_000, b) }
func BenchmarkGoSort100000(b *testing.B) { benchmarkGoSort(100_000, b) }
```
</p>
</details>

## Final thoughts

If you read the article and came this far, thank you very much. I hope I was
able illustrate how would be like to develop a sorting algorithm driven by
tests.

You might have noticed that I wasn't too concerned about picking up the most
performing algorithm implementation, to begin with, but rather, I was interested
to go through the journey of having written **code guided by tests**. In other
words, **my intention was to have tests that would justify the existence of any
kind of implementation and avoid adding any extra code if there is no test for
it** and I hope I could make it clear and enjoyable.

### Thank you for reading

I hope you enjoy this post, if you have any feedback or questions, hit me up on
<alabeduarte@gmail.com>, I'd be happy to hear your thoughts and be better next
time!

### Other References

* [Test-Driven Development by
  Example](https://www.amazon.com.au/Test-Driven-Development-Kent-Beck/dp/0321146530)
* [Growing Object-Oriented Software, Guided by
  Tests](https://www.amazon.com.au/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627)
* [Test-Driven Development: Teste e Design no Mundo Real (Portuguese
  Edition)](https://www.amazon.com/Test-Driven-Development-Teste-Design-Portuguese-ebook/dp/B00WKMN24W)
